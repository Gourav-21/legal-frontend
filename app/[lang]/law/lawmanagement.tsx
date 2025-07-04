'use client';

import React, { useState, useEffect } from 'react';
import { Law } from './page';

// Client-side component for law management
export function LawManagement({ dictionary }: { dictionary: any }) {
    const [laws, setLaws] = useState<Law[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // For adding new laws
    const [newLawText, setNewLawText] = useState('');
    const [isAddingLaw, setIsAddingLaw] = useState(false);
  
    // For editing laws
    const [editLawId, setEditLawId] = useState<string | null>(null);
    const [editLawText, setEditLawText] = useState('');
  
    // Use the frontend API routes that proxy to backend
    const API_BASE = '';
  
    // Fetch all laws on component mount
    useEffect(() => {
      fetchLaws();
    }, []);
    // Fetch all laws from the API
    const fetchLaws = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/laws`);

        if (!response.ok) {
          throw new Error(dictionary.law?.errors?.fetchFailed || `Error fetching laws: ${response.statusText}`);
        }

        const data = await response.json();
        setLaws(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : dictionary.law?.errors?.genericFetch || 'Failed to fetch laws');
        console.error('Error fetching laws:', err);
      } finally {
        setLoading(false);
      }
    };
    // Add a new law
    const addLaw = async () => {
      if (!newLawText.trim()) return;

      try {
        setIsAddingLaw(true);
        const response = await fetch(`${API_BASE}/api/laws`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newLawText }),
        });

        if (!response.ok) {
          throw new Error(dictionary.law?.errors?.addFailed || `Error adding law: ${response.statusText}`);
        }

        const newLaw = await response.json();
        setLaws([...laws, newLaw]);
        setNewLawText('');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : dictionary.law?.errors?.genericAdd || 'Failed to add law');
        console.error('Error adding law:', err);
      } finally {
        setIsAddingLaw(false);
      }
    };
    // Delete a law
    const deleteLaw = async (id: string) => {
      if (!confirm(dictionary.law?.confirmDelete || 'Are you sure you want to delete this law?')) return;

      try {
        const response = await fetch(`${API_BASE}/api/laws/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(dictionary.law?.errors?.deleteFailed || `Error deleting law: ${response.statusText}`);
        }

        setLaws(laws.filter(law => law.id !== id));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : dictionary.law?.errors?.genericDelete || 'Failed to delete law');
        console.error('Error deleting law:', err);
      }
    };
  
    // Start editing a law
    const startEditLaw = (law: Law) => {
      setEditLawId(law.id);
      setEditLawText(law.text);
    };
  
    // Cancel editing
    const cancelEdit = () => {
      setEditLawId(null);
      setEditLawText('');
    };
    // Save edited law
    const saveEditedLaw = async () => {
      if (!editLawId || !editLawText.trim()) return;

      try {
        const response = await fetch(`${API_BASE}/api/laws/${editLawId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: editLawText }),
        });

        if (!response.ok) {
          throw new Error(dictionary.law?.errors?.updateFailed || `Error updating law: ${response.statusText}`);
        }

        const updatedLaw = await response.json();
        setLaws(laws.map(law => law.id === editLawId ? updatedLaw : law));
        setEditLawId(null);
        setEditLawText('');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : dictionary.law?.errors?.genericUpdate || 'Failed to update law');
        console.error('Error updating law:', err);
      }
    };
  
    return (
      <div className="law-management-container">
        {/* Error message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
  
        {/* Add new law section */}
        <div className="row my-4" data-aos="fade-up" data-aos-duration="1500">
          <div className="col-9">
            <textarea
              className="form-control"
              rows={4}
              placeholder={dictionary.law?.newLawPlaceholder || "Enter the labor law text..."}
              value={newLawText}
              onChange={(e) => setNewLawText(e.target.value)}
            />
          </div>
          <div className="col-3">
            <button
              className="btn without-icon btn-yellow w-100 h-100"
              onClick={addLaw}
              disabled={isAddingLaw || !newLawText.trim()}
            >
              {isAddingLaw ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {dictionary.law?.addingButton || "Adding..."}
                </>
              ) : (
                <>
                  {dictionary.law?.addButton || "Add New Law"}
                  <span><i className="bi bi-arrow-right-short"></i></span>
                </>
              )}
            </button>
          </div>
        </div>
  
        {/* Laws list section */}
        <div className="laws-list">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">{dictionary.law?.loading || "Loading..."}</span>
              </div>
              <p className="mt-2">{dictionary.law?.loadingLaws || "Loading laws..."}</p>
            </div>
          ) : laws.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-exclamation-circle fs-1"></i>
              <p className="mt-2">{dictionary.law?.noLaws || "No labor laws found. Add your first law above."}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>{dictionary.law?.lawTextHeader || "Law Text"}</th>
                    <th className="text-end">{dictionary.law?.actionsHeader || "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {laws.map(law => (
                    <tr key={law.id}>
                      <td className="align-middle">
                        {editLawId === law.id ? (
                          <textarea
                            className="form-control"
                            rows={3}
                            value={editLawText}
                            onChange={(e) => setEditLawText(e.target.value)}
                          />
                        ) : (
                          law.text
                        )}
                      </td>
                      <td className="text-end" dir='ltr'>
                        {editLawId === law.id ? (
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={saveEditedLaw}
                              title={dictionary.law?.saveTip || "Save changes"}
                            >
                              <i className="bi bi-check-lg"></i> {dictionary.law?.saveButton || "Save"}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={cancelEdit}
                              title={dictionary.law?.cancelTip || "Cancel editing"}
                            >
                              <i className="bi bi-x-lg"></i> {dictionary.law?.cancelButton || "Cancel"}
                            </button>
                          </div>
                        ) : (
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => startEditLaw(law)}
                              title={dictionary.law?.editTip || "Edit this law"}
                            >
                              <i className="bi bi-pencil"></i> {dictionary.law?.editButton || "Edit"}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteLaw(law.id)}
                              title={dictionary.law?.deleteTip || "Delete this law"}
                            >
                              <i className="bi bi-trash"></i> {dictionary.law?.deleteButton || "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
  