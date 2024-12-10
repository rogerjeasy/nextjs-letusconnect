// components/faqs/FAQsAdmin.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Tooltip,
  Textarea,
} from "@nextui-org/react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaBoxOpen,
} from "react-icons/fa";
import { api } from "../../helpers/api";
import { useUserStore } from "../../store/userStore";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import { extractDateAndTime } from "../utils/dateUtils";
import SingleDropdownSelection from "@/components/forms/SingleSelection";
import { faqCategories } from "../dropdownoptions/faqCategories";
import ModalPopup from "../forms/ModalPopup";

interface FAQ {
  id: string;
  question: string;
  response: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  username: string;
}

export default function FAQsAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: "", response: "", category: "" });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, restoreUser, loading: userLoading } = useUserStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  // Restore user data on page load
  useEffect(() => {
    restoreUser();
  }, [restoreUser]);
  
  // Fetch FAQs when the component mounts
  useEffect(() => {
    fetchFAQs();
  }, [isAuthenticated, user]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/faqs");
      setFaqs(response.data);
      setFilteredFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFaqs(filtered);
  };

  const handleCreateFAQ = async () => {
    try {
      setLoading(true);
      await api.post("/api/faqs", newFAQ, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsModalOpen(false);
      setNewFAQ({ question: "", response: "", category: "" });
      fetchFAQs();
    } catch (error) {
      console.error("Error creating FAQ:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteFAQ = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/api/faqs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    } finally {
      setLoading(false);
    }
  }

  const openDeleteModal = (id: string) => {
    setFaqToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (faqToDelete) {
      await handleDeleteFAQ(faqToDelete);
      setIsDeleteModalOpen(false);
      setFaqToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setFaqToDelete(null);
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <AccessDenied condition={!isAuthenticated || !user?.role?.includes("admin")} message="Access Denied: Admin privileges required." />

      <div className="p-8">
        {/* Centered Title */}
        <h2 className="text-3xl font-bold mb-4 text-center">FAQs Management</h2>

        <ModalPopup
          isOpen={isDeleteModalOpen}
          title="Confirm Deletion"
          content="Are you sure you want to delete this FAQ? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmColor="danger"
          cancelColor="default"
          showCancelButton={true}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {/* Centered Caution */}
        <div className="flex items-center justify-center mb-6 text-yellow-600">
          <FaExclamationCircle className="mr-2" />
          <p>
            Caution: Admin users can create, edit, and delete FAQs. Please ensure the information
            is accurate before making changes.
          </p>
        </div>

        {/* Centered Create Button */}
        <div className="flex justify-center mb-6">
          <Button color="secondary" startContent={<FaPlus />} onClick={() => setIsModalOpen(true)}>
            Create a New FAQ
          </Button>
        </div>

        {/* Modal for Creating New FAQ */}
        <Modal isOpen={isModalOpen} 
          onOpenChange={() => setIsModalOpen(false)} 
          // size="lg"
          className="max-w-2xl"
        >
          <ModalContent>
            <ModalHeader className="text-center w-full justify-center">
              Create New FAQ
            </ModalHeader>
            <ModalBody>
            <SingleDropdownSelection
              options={faqCategories}
              label="Category"
              placeholder="Select a category"
              onChange={(selectedKey) => setNewFAQ({ ...newFAQ, category: selectedKey })}
            />
              <Input
                isRequired
                label="Question"
                placeholder="Enter the question"
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                fullWidth
              />
              <Textarea
                isRequired
                label="Response"
                placeholder="Enter the response"
                value={newFAQ.response}
                onChange={(e) => setNewFAQ({ ...newFAQ, response: e.target.value })}
                fullWidth
              />
            </ModalBody>
            <ModalFooter className="flex justify-center gap-4">
              <Button color="danger" onPress={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleCreateFAQ} isLoading={loading}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Centered Search Bar with Decreased Width */}
        <div className="my-6 flex justify-center">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search FAQs..."
              startContent={<FaSearch />}
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              // className="bg-black text-white border border-gray-500 rounded-md"
            />
          </div>
        </div>

        {/* FAQs Table */}
        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table aria-label="FAQs Table" className="border-separate border-spacing-y-2">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Question</TableColumn>
              <TableColumn>Response</TableColumn>
              <TableColumn>Created By</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Last Update</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredFaqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <FaBoxOpen className="text-6xl text-gray-400 mb-4" />
                    <p className="text-gray-500">No FAQs available</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFaqs.map((faq) => (
                  <TableRow key={faq.id}>
                  <TableCell>{faq.id}</TableCell>
                  <TableCell>{faq.question}</TableCell>
                  <TableCell>{faq.response}</TableCell>
                  <TableCell>{faq.username}</TableCell>
                  <TableCell>
                    {faq.createdAt
                      ? (() => {
                          const { date, time } = extractDateAndTime(faq.createdAt);
                          return (
                            <div>
                              <div>{date}</div>
                              <div className="text-xs text-gray-500">{time}</div>
                            </div>
                          );
                        })()
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                    {faq.updatedAt
                      ? (() => {
                          const { date, time } = extractDateAndTime(faq.updatedAt);
                          return (
                            <div>
                              <div>{date}</div>
                              <div className="text-xs text-gray-500">{time}</div>
                            </div>
                          );
                        })()
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="Edit FAQ">
                    <Button isIconOnly color="warning" variant="light">
                      <FaEdit />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete FAQ">
                  <Button isIconOnly
                    color="danger" 
                    variant="light" 
                    onClick={() => openDeleteModal(faq.id)}
                  >
                    <FaTrash />
                  </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}