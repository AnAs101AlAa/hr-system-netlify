import { useGetAllUsers, useDeleteUser } from "@/shared/queries/users";
import { useState, useEffect } from "react";
import { Button, DropdownMenu, SearchField } from "tccd-ui";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { USERS_SORTING_OPTIONS, TEAM_COMMITTEES } from "@/constants/usersConstants";
import Table from "@/shared/components/table/Table";
import CardView from "@/shared/components/table/CardView";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { member } from "@/shared/types/member";
import { IoTrashSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

const UserList = ({ setModalOpen }: { setModalOpen: React.Dispatch<React.SetStateAction<member|null>> }) => {
    const PAGE_SIZE = 20;

    const [currentPage, setCurrentPage] = useState(0);
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const [displayedUsers, setDisplayedUsers] = useState<member[]>([]);
    const [sortOption, setSortOption] = useState("");
    const [filterCommittee, setFilterCommittee] = useState("All");
    const userRoles = useSelector((state: any) => state.auth.user?.roles || []);

    const deleteEventMutation = useDeleteUser();

    const handleDelete = (userId: string) => {
        deleteEventMutation.mutate(userId, {
            onSuccess: () => {
                toast.success("Member deleted successfully");
            },
            onError: () => {
                toast.error("Failed to delete member");
            },
        });
    };

    useEffect(() => {
        setCurrentPage(0);
    }, [userSearchTerm, filterCommittee]);

    const { data: members, isLoading, isError } = useGetAllUsers();


    useEffect(() => {
        if (!members) {
            setDisplayedUsers([]);
            return;
        }

        let filtered = members.filter((user: member) =>
            user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
        );

        if (filterCommittee && filterCommittee !== "All") {
            filtered = filtered.filter((user: member) => user.committee === filterCommittee);
        }

        if (sortOption) {
            filtered = [...filtered].sort((a: member, b: member) => {
                switch (sortOption) {
                    case "az":
                        return a.name.localeCompare(b.name);
                    case "za":
                        return b.name.localeCompare(a.name);
                    case "caz":
                        return a.committee.localeCompare(b.committee);
                    case "cza":
                        return b.committee.localeCompare(a.committee);
                    default:
                        return 0;
                }
            });
        }

        setDisplayedUsers(filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE));
    }, [userSearchTerm, members, currentPage, filterCommittee, sortOption]);

    return (
        <div className="bg-white dark:bg-surface-glass-bg rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
        <div className="p-4 border-b border-dashboard-border space-y-2">
            <div className="flex items-center justify-between mb-4">
            <p className="text-md md:text-lg lg:text-xl font-bold text-text-muted-foreground">
                Users {displayedUsers ? `(${members ? members.length : 0})` : ""}
            </p>
            <div className="flex gap-2 items-center justify-center">
                <FaChevronLeft
                className={`cursor-pointer size-4 ${currentPage === 0 ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
                onClick={() => {
                    if (currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                    }
                }}
                />
                <span className="text-[14px] md:text-[15px] lg:text-[16px] font-medium text-contrast dark:text-text-title">
                Page {currentPage + 1}
                </span>
                <FaChevronRight
                className={`cursor-pointer size-4 ${displayedUsers && displayedUsers.length < PAGE_SIZE ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
                onClick={() => {
                    if (displayedUsers && displayedUsers.length === PAGE_SIZE) {
                    setCurrentPage(currentPage + 1);
                    }
                }}
                />
            </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-contrast dark:text-text-title">
            Filters
            </p>
            <div className="flex gap-2 md:flex-row flex-col justify-between">
            <SearchField
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(value) => setUserSearchTerm(value)}
            />
            <div className="flex-col flex flex-1 justify-end md:flex-row gap-2">
                <div className="grow md:max-w-64">
                <DropdownMenu
                    options={USERS_SORTING_OPTIONS}
                    value={sortOption}
                    onChange={(val) => setSortOption(val)}
                    placeholder="Sort By"
                />
                </div>
                <div className="grow md:max-w-64">
                    <DropdownMenu
                        options={TEAM_COMMITTEES}
                        value={filterCommittee}
                        onChange={(val) => setFilterCommittee(val)}
                        placeholder="Filter by Committee"
                    />
                </div>
            </div>
            </div>
        </div>
        {isLoading ? (
            <div className="flex justify-center items-center h-48">
            <p className="text-contrast dark:text-text-title">Loading members...</p>
            </div>
        ) : isError ? (
            <div className="flex justify-center items-center h-48">
                <p className="text-contrast dark:text-text-title">
                    Error loading Members. Please try again.
                </p>
            </div>
        ) : (
            <>
                <Table
                    items={displayedUsers || []}
                    modalTitle="Delete Member"
                    modalSubTitle="Are you sure you want to delete this member? This action cannot be undone."
                    isSubmitting={deleteEventMutation.isPending}
                    confirmationAction={(user) => handleDelete(user.id)}
                    columns={[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "phoneNumber", label: "Phone Number" },
                    { key: "nationalId", label: "National ID" },
                    { key: "gradYear", label: "Graduation Year" },
                    { key: "committee", label: "Committee", formatter: (value) => TEAM_COMMITTEES.find(committee => committee.value === value)?.label || "N/A" },
                    { key: "position", label: "Position" },
                    ]}
                    emptyMessage="No members found."
                    renderActions={(item, triggerDelete) => (
                    <>
                        {userRoles.includes("Admin") && (
                        <>
                        <Button
                            type="secondary"
                            onClick={() => setModalOpen(item)}
                            buttonText="Edit"
                            width="fit" />
                        <Button
                            type="danger"
                            onClick={() => triggerDelete(item.id)}
                            buttonText="Delete"
                            width="fit"
                            />
                        </>
                        )}
                    </>
                    )}
                />

                <CardView 
                    items={displayedUsers || []}
                    titleKey="name"
                    renderedFields={[
                        { key: "email", label: "Email" },
                        { key: "phoneNumber", label: "Phone Number" },
                        { key: "nationalId", label: "National ID" },
                        { key: "gradYear", label: "Graduation Year" },
                        { key: "committee", label: "Committee", formatter: (value) => TEAM_COMMITTEES.find(committee => committee.value === value)?.label || "N/A" },
                        { key: "position", label: "Position" },
                    ]}
                    renderButtons={(item, triggerDelete) => (
                        <>
                            {userRoles.includes("Admin") && (
                                <>
                                    <Button
                                        type="secondary"
                                        onClick={() => setModalOpen(item)}
                                        buttonIcon={<FaEdit size={16} />}
                                        width="fit" />
                                    <Button
                                        type="danger"
                                        onClick={() => triggerDelete(item.id)}
                                        buttonIcon={<IoTrashSharp size={16} />}
                                        width="fit"
                                    />
                                </>
                            )}
                        </>
                    )}
                    emptyMessage="No members found."
                    modalTitle="Delete Member"
                    modalSubTitle="Are you sure you want to delete this member? This action cannot be undone."
                    isSubmitting={deleteEventMutation.isPending}
                    confirmationAction={(user) => handleDelete(user.id)}
                />
            </>
        )}
        </div>
    );
};

export default UserList;
