import WithNavbar from "@/shared/components/hoc/WithNavbar";
import {FormList} from "@/features/formBuilding/components";
import { useState } from "react";
import { ButtonTypes, Button, Modal, SearchField } from "tccd-ui";
import { FaPlus } from "react-icons/fa";
import { ImInsertTemplate } from "react-icons/im";
import { VscEmptyWindow } from "react-icons/vsc";
import { useForms } from "@/shared/queries/forms/formQueries";

export default function FormBuilder() {
    const [modalOpen, setModalOpen] = useState(0);
    const [formSearchTerm, setFormSearchTerm] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<null | string>(null);
    const { data: Forms } = useForms(1, 1000, "", "", "", "");
    const filteredForms = Forms?.filter((form) => form.title.toLowerCase().includes(formSearchTerm.toLowerCase())) || [];
    
    return (
        <WithNavbar>
        {modalOpen !== 0 && (
            <Modal title="Create New Form" isOpen={modalOpen !== 0} onClose={() => setModalOpen(0)} className="lg:min-w-[42%]">
                <div className="p-4">
                    {(modalOpen === 1) ? (
                    <>
                        <p className="mb-6 lg:text-[18px] md:text-[15px] text-[14px] font-semibold text-center">Please choose a template for the new form</p>
                        <div className="md:flex-row flex-col flex justify-center gap-3">
                            <div className="w-full md:w-[49%] rounded-2xl shadow-md p-3 md:p-4 hover:-translate-y-2 hover:bg-gray-100 cursor-pointer transition ease-in-out duration-300" onClick={() => window.location.href = "/form-builder/new"}>
                                <VscEmptyWindow className="lg:size-18 md:size-16 size-14 mx-auto mb-5 md:mb-10 mt-2 md:mt-4" />
                                <p className="text-center mb-1 font-semibold lg:text-[20px] md:text-[18px] text-[16px]">Blank Form</p>
                                <p className="text-center mb-4 text-sm text-inactive-tab-text">Start from scratch and build your form step by step.</p>
                            </div>
                            <div className="w-full md:w-[49%] rounded-2xl shadow-md p-3 md:p-4 hover:-translate-y-2 hover:bg-gray-100 cursor-pointer transition ease-in-out duration-300" onClick={() => setModalOpen(2)}>
                                <ImInsertTemplate className="lg:size-18 md:size-16 size-14 mx-auto mb-5 md:mb-10 mt-2 md:mt-4" />
                                <p className="text-center mb-1 font-semibold lg:text-[20px] md:text-[18px] text-[16px]">Predefined Template</p>
                                <p className="text-center mb-4 text-sm text-inactive-tab-text">Use a predefined form as a starting base for a new form.</p>
                            </div>
                        </div>
                    </>
                    ) : (
                        <>
                        <p className="mb-6 lg:text-[18px] md:text-[15px] text-[14px] font-semibold text-center">Please select the form you wish to use as your template</p>
                        <div className="w-full rounded-lg shadow-lg md:p-4 p-2">
                            <SearchField className="lg:w-full" placeholder="Search for a form..." value={formSearchTerm} onChange={(value) => setFormSearchTerm(value)} />
                            <div className="max-h-[400px] overflow-y-auto mt-4 overflow-x-auto">
                                {(filteredForms.length === 0) ? (
                                    <p className="text-center text-inactive-tab-text mt-10">No forms found.</p>
                                ) : (
                                    <>
                                    <table className="w-full text-left border-gray-100 rounded-xl border">
                                        <thead className="bg-gray-100 border-b border-dashboard-border rounded-t-xl">
                                            <tr>
                                                <th className="px-3 py-2 text-sm font-semibold text-inactive-tab-text">Name</th>
                                                <th className="px-3 py-2 text-sm font-semibold text-inactive-tab-text">Id</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredForms.map((form) => (
                                                <tr key={form.id} className={`text-[12px] md:text-[14px] lg:text-[16px] whitespace-nowrap rounded-lg cursor-pointer ${selectedTemplate === form.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`} onClick={() => setSelectedTemplate(form.id)}>
                                                    <td className="px-3 py-2">{form.title}</td>
                                                    <td className="px-3 py-2">{form.id}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </>
                                )}
                            </div>
                            <div className="mt-8 mb-2 flex justify-center items-center gap-3">
                                <Button type={ButtonTypes.SECONDARY} onClick={() => setModalOpen(1)} buttonText="Back" />
                                <Button type={ButtonTypes.PRIMARY} onClick={() => { if (selectedTemplate) window.location.href = `/form-builder/new?template=${selectedTemplate}` }} buttonText="Use Template" disabled={!selectedTemplate} />
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </Modal>
        )}
        <div className="min-h-screen bg-background p-4">
            <div className="w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto">
                <h1 className="lg:text-[24px] md:text-[22px] text-[20px] font-bold">Form Builder</h1>
                <p className="mb-2 lg:text-[16px] md:text-[14px] text-[13px] text-inactive-tab-text">Create and manage custom forms for data collection and analysis.</p>
                <div className="w-full my-4">
                <Button buttonText="New Form" onClick={() => setModalOpen(1)} type={ButtonTypes.PRIMARY} width="auto" buttonIcon={<FaPlus />} />
                </div>
                <FormList/>
            </div>
        </div>
        </WithNavbar>
    )
}
