import { useEffect, useState } from "react";
import type { Team } from "@/shared/types/judgingSystem";
import { useCreateTeam, useUpdateTeam } from "@/shared/queries/judgingSystem/judgeQueries";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import DEPARTMENT_LIST from "@/constants/departments";

export default function useManageTeamModalUtils (eventId: string, mode: number, teamData: Team | undefined) {
    const [teamDataState, setTeamDataState] = useState<Team | undefined>({id: "", name: "", code: "", course: "", department: "", teamMembers: []});
    const [formErrors, setFormErrors] = useState<{attr: string, value:string}[]>([]);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [uploadError, setUploadError] = useState<string>("");
    
    const createTeamMutation = useCreateTeam();
    const updateTeamMutation = useUpdateTeam();
    const isLoading = createTeamMutation.isPending || updateTeamMutation.isPending;

    useEffect(() => {
        if(mode == 2 && teamData) {
            setTeamDataState(teamData);
        }
    }, [teamData]);

    const validateTeamData = (): {attr: string, value:string}[] => {
        const errors: {attr: string, value:string}[] = [];

        if (!teamDataState?.name || teamDataState.name.trim() === "") errors.push({attr: "name", value: "Team name is required."});
        if (!teamDataState?.code || teamDataState.code.trim() === "") errors.push({attr: "code", value: "Team Code is required."});
        if (!teamDataState?.course || teamDataState.course.trim() === "") errors.push({attr: "course", value: "Team Course is required"});
        if (!teamDataState?.department || teamDataState.department.trim() === "") errors.push({attr: "department", value: "Team Department is required"});
        if (!teamDataState?.teamMembers || teamDataState.teamMembers.length === 0) errors.push({attr: "teamMembers", value: "Team Must include at least 1 member."});
        return errors;
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessingFile(true);
        setUploadError("");

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            
            // Get the first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            
            if (jsonData.length < 2) {
                setUploadError("Excel file is empty or has no data rows.");
                setIsProcessingFile(false);
                return;
            }

            // Get headers (first row)
            const headers = jsonData[0].map((h: any) => String(h).toLowerCase().trim());
            
            // Find column indices
            const nameIndex = headers.findIndex((h: string) => h.includes("team name") || h.includes("name"));
            const courseIndex = headers.findIndex((h: string) => h.includes("course"));
            const codeIndex = headers.findIndex((h: string) => h.includes("code"));
            const departmentIndex = headers.findIndex((h: string) => h.includes("department"));
            const membersIndex = headers.findIndex((h: string) => h.includes("member") || h.includes("members"));

            // Validate required columns exist
            if (nameIndex === -1 || courseIndex === -1 || codeIndex === -1 || departmentIndex === -1 || membersIndex === -1) {
                setUploadError("Missing required columns. Please ensure your Excel has: Team Name, Course, Code, Department, and Team Members columns.");
                setIsProcessingFile(false);
                return;
            }

            // Create department lookup map (label -> value)
            const departmentMap = new Map(
                DEPARTMENT_LIST.map(dept => [dept.label.toLowerCase(), dept.value])
            );

            // Parse teams from rows (skip header row)
            const teams: Team[] = [];
            const invalidDepartments: string[] = [];
            
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                
                // Skip empty rows
                if (!row || row.length === 0 || !row[nameIndex]) continue;

                const teamName = String(row[nameIndex] || "").trim();
                const course = String(row[courseIndex] || "").trim();
                const code = String(row[codeIndex] || "").trim();
                const departmentLabel = String(row[departmentIndex] || "").trim();
                const membersStr = String(row[membersIndex] || "").trim();

                // Skip rows with empty required fields
                if (!teamName || !course || !code || !departmentLabel) continue;

                // Map department label to value
                const departmentValue = departmentMap.get(departmentLabel.toLowerCase());
                
                if (!departmentValue) {
                    invalidDepartments.push(`${teamName} (${departmentLabel})`);
                    continue;
                }

                // Parse team members (comma-separated)
                const memberNames = membersStr
                    .split(",")
                    .map((name: string) => name.trim())
                    .filter((name: string) => name.length > 0);

                const teamMembers = memberNames.map((name: string, index: number) => ({
                    id: `${i}-${index}`,
                    name: name
                }));

                teams.push({
                    id: `upload-${i}`,
                    name: teamName,
                    code: code,
                    course: course,
                    department: departmentValue, // Use the mapped value
                    teamMembers: teamMembers
                });
            }

            if (invalidDepartments.length > 0) {
                setUploadError(`Invalid departments found: ${invalidDepartments.join(", ")}. Please use exact department names from the dropdown.`);
                setIsProcessingFile(false);
                return;
            }

            if (teams.length === 0) {
                setUploadError("No valid team data found in the Excel file.");
                setIsProcessingFile(false);
                return;
            }

            // Upload teams sequentially
            let successCount = 0;
            const failedTeams: string[] = [];

            for (const team of teams) {
                try {
                    await new Promise((resolve, reject) => {
                        createTeamMutation.mutate(
                            { eventId: eventId, teamData: team },
                            {
                                onSuccess: () => {
                                    successCount++;
                                    resolve(true);
                                },
                                onError: (error) => {
                                    failedTeams.push(team.name);
                                    reject(error);
                                }
                            }
                        );
                    });
                } catch (error) {
                    // Error already handled in onError callback
                    console.error(`Failed to upload team: ${team.name}`, error);
                }
            }

            // Show results
            if (successCount === teams.length) {
                toast.success(`Successfully uploaded all ${teams.length} team(s)!`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else if (successCount > 0) {
                toast.success(`Uploaded ${successCount} out of ${teams.length} team(s).`);
                if (failedTeams.length > 0) {
                    toast.error(`Failed to upload: ${failedTeams.join(", ")}`);
                }
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error("Failed to upload any teams. Please try again.");
            }
            
            // Reset file input
            event.target.value = "";

        } catch (error) {
            console.error("Error processing file:", error);
            setUploadError("Failed to process Excel file. Please check the file format.");
        } finally {
            setIsProcessingFile(false);
        }
    };

    const submitTeam = () => {
        setTeamDataState((prev : Team | undefined) => {
            if (!prev) return prev;
            return {id: prev.id, name: prev.name.trim(), code: prev.code.trim(), course: prev.course.trim(), department: prev.department.trim(), teamMembers: prev.teamMembers.map(mem => {return {...mem, name: mem.name.trim()}})};
        });
        const errors = validateTeamData();
        if(errors.length > 0) {
            setFormErrors(errors);
            return;
        }
        if(mode === 1) {
            createTeamMutation.mutate({eventId: eventId, teamData: teamDataState as Team }, {
                onSuccess: () => {
                    toast.success("Team created successfully.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                onError: () => {
                    toast.error("Failed to create team, please try again later.")
                }
            });
        } else if (mode === 2) {
            updateTeamMutation.mutate({teamData: teamDataState as Team, oldTeamData: teamData as Team}, {
                onSuccess: () => {
                    toast.success("Team updated successfully.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                onError: () => {
                    toast.error("Failed to update team, please try again later.")
                }
            });
        }
    }

    const handleChangeTeamData = (attr: keyof Team, value: string) => {
        setTeamDataState((prev : Team | undefined) => prev ? {...prev, [attr]: value} : prev);
    }

    const handleAddMember = () => {
        if (!teamDataState) return;
        const newMember = { id: (teamDataState.teamMembers.length + 1).toString(), name: "" };
        setTeamDataState({ ...teamDataState, teamMembers: [...teamDataState.teamMembers, newMember] });
    }

    const handleChangeMemberName = (memberId: string, newName: string) => {
        if (!teamDataState) return;
        const updatedMembers = teamDataState.teamMembers.map(member => 
            member.id === memberId ? { ...member, name: newName } : member
        );
        setTeamDataState({ ...teamDataState, teamMembers: updatedMembers });
    }

    const handleDeleteMember = (memberId: string) => {
        if (!teamDataState) return;
        const updatedMembers = teamDataState.teamMembers.filter(member => member.id !== memberId);
        setTeamDataState({ ...teamDataState, teamMembers: updatedMembers });
    }

    return {
        teamDataState,
        handleAddMember,
        handleDeleteMember,
        handleChangeMemberName,
        validateTeamData,
        handleChangeTeamData,
        formErrors,
        submitTeam,
        isLoading,
        handleFileUpload,
        isProcessingFile,
        uploadError
    }
}