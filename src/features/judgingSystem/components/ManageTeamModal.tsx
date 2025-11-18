import type { Team } from "@/shared/types/judgingSystem";
import { Modal, TextDisplayEdit, Button } from "tccd-ui";
import { HiOutlineTrash } from "react-icons/hi2";
import useManageTeamModalUtils from "../utils/ManageTeamFormUtils";

export default function ManageTeamModal({isOpen, onClose, mode, teamData, eventId}: {isOpen: boolean; onClose: () => void; mode: number; teamData?: Team; eventId: string}) {
    const { teamDataState, handleAddMember, handleDeleteMember, handleChangeMemberName, handleChangeTeamData, formErrors, submitTeam, isLoading } = useManageTeamModalUtils(eventId, mode, teamData);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={mode === 1 ? "Create New Team" : "Edit Team"}>
            <div className="space-y-3.5 md:mb-8 mb-6">
                <p className="text-[16px] md:text-[17px] lg:text-[18px] font-semibold text-contrast">Team Information</p>
                <div className="space-y-0.5">
                    <TextDisplayEdit label="Team Name" value={teamDataState ? teamDataState.name : ""} placeholder="Enter team name" onChange={val => handleChangeTeamData("name", val)} />
                    {formErrors.find(err => err.attr === "name") && 
                        <p className="text-red-500 text-sm">{formErrors.find(err => err.attr === "name")?.value}</p>
                    }
                </div>
                <div className="space-y-0.5">
                    <TextDisplayEdit label="Team Code" value={teamDataState ? teamDataState.code : ""} placeholder="Enter team code" onChange={val => handleChangeTeamData("code", val)} />
                    {formErrors.find(err => err.attr === "code") && 
                        <p className="text-red-500 text-sm">{formErrors.find(err => err.attr === "code")?.value}</p>
                    }
                </div>
                <div className="space-y-0.5">
                    <TextDisplayEdit label="Course" value={teamDataState ? teamDataState.course : ""} placeholder="Enter course name" onChange={val => handleChangeTeamData("course", val)} />
                    {formErrors.find(err => err.attr === "course") && 
                        <p className="text-red-500 text-sm">{formErrors.find(err => err.attr === "course")?.value}</p>
                    }                
                </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-[16px] md:text-[17px] lg:text-[18px] font-semibold text-contrast">Team Members</p>
                    {teamDataState?.teamMembers && teamDataState.teamMembers.length === 0 ? (
                        <p className="text-contrast text-[14px] md:text-[15px] lg:text-[16px]">No team members added yet.</p>
                    ) : (
                        <div className="max-h-[272px] overflow-auto space-y-2">
                        {teamDataState && teamDataState.teamMembers.map((member, index) => (
                            <div key={index} className="flex h-9 md:h-11">
                                <div className="flex justify-center border border-r-0 border-gray-300 rounded-l-lg flex-grow items-center lg:text-[16px] md:text-[15px] text-[14px] font-medium text-contrast">
                                    <input placeholder={`Member ${index + 1}`} className="h-full w-full px-2 focus:outline-none" onChange={(e) => handleChangeMemberName(member.id, e.target.value)} value={member.name} />
                                </div>
                                <div className="flex justify-center items-center bg-primary/85 w-[15%] lg:w-[10%] rounded-r-lg cursor-pointer hover:bg-primary transition-colors" onClick={() => handleDeleteMember(member.id)}>
                                    <HiOutlineTrash className="lg:size-4.5 text-white" />
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                    <Button type="primary" buttonText="Add Member" width="fit" onClick={handleAddMember} />
                </div>
            </div>
            <hr className="mt-2 md:mt-3 border-muted-primary" />
            <div className="flex justify-center gap-2 mt-4">
                <Button type="secondary" buttonText="Cancel" width="auto" onClick={onClose} />
                <Button type="primary" buttonText={mode === 1 ? "Create Team" : "Save Changes"} width="auto" onClick={submitTeam} loading={isLoading} />
            </div>
        </Modal>
    );
}