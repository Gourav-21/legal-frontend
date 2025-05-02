'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from "../../../i18n-config";
import { getDictionary } from "../../../get-dictionary";
import Image from 'next/image';

interface Law {
  id: string;
  text: string;
}

interface LawPageProps {
  params: { lang: Locale };
}

// Split into a client component and a server component
export default function LawPage({ params }: LawPageProps) {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <h1 className="text-center mt-4" data-aos="fade-up" data-aos-duration="1500">Labor Law Management</h1>
          <p className="text-lg text-center mb-xl-5 mb-4" data-aos="fade-up" data-aos-duration="1500">
            View, add, edit, and delete labor laws in our system
          </p>
          
          <div className="Upload-document" data-aos="fade-up" data-aos-duration="1500">
            <Image 
              className="vector1" 
              src="/img/vector1.svg" 
              alt="vector" 
              width={200} 
              height={200}
              data-aos="fade-right" 
              data-aos-offset="300"
              data-aos-easing="ease-in-sine"
            />
            <Image className="coin1 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
            <Image className="coin2 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
            <h3 className="mb-1">Labor Law Database</h3>
            <p className="mb-3">Manage all your labor laws in one place</p>
            
            <LawManagement />
          </div>
        </div>
      </section>
    </main>
  );
}

// Client-side component for law management
function LawManagement() {
  const [laws, setLaws] = useState<Law[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For adding new laws
  const [newLawText, setNewLawText] = useState('');
  const [isAddingLaw, setIsAddingLaw] = useState(false);
  
  // For editing laws
  const [editLawId, setEditLawId] = useState<string | null>(null);
  const [editLawText, setEditLawText] = useState('');
  
  // Backend API URL - replace with your FastAPI backend URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Fetch all laws on component mount
  useEffect(() => {
    fetchLaws();
  }, []);
  
  // Fetch all laws from the API
  const fetchLaws = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/laws`);
      
      if (!response.ok) {
        throw new Error(`Error fetching laws: ${response.statusText}`);
      }
      
      const data = await response.json();
      setLaws(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch laws');
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
      const response = await fetch(`${API_URL}/api/laws`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newLawText }),
      });
      
      if (!response.ok) {
        throw new Error(`Error adding law: ${response.statusText}`);
      }
      
      const newLaw = await response.json();
      setLaws([...laws, newLaw]);
      setNewLawText('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add law');
      console.error('Error adding law:', err);
    } finally {
      setIsAddingLaw(false);
    }
  };
  
  // Delete a law
  const deleteLaw = async (id: string) => {
    if (!confirm('Are you sure you want to delete this law?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/laws/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting law: ${response.statusText}`);
      }
      
      setLaws(laws.filter(law => law.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete law');
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
      const response = await fetch(`${API_URL}/api/laws/${editLawId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editLawText }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating law: ${response.statusText}`);
      }
      
      const updatedLaw = await response.json();
      setLaws(laws.map(law => law.id === editLawId ? updatedLaw : law));
      setEditLawId(null);
      setEditLawText('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update law');
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
            placeholder="Enter the labor law text..."
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
                Adding...
              </>
            ) : (
              <>
                Add New Law
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
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading laws...</p>
          </div>
        ) : laws.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-exclamation-circle fs-1"></i>
            <p className="mt-2">No labor laws found. Add your first law above.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Law Text</th>
                  <th className="text-end">Actions</th>
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
                    <td className="text-end">
                      {editLawId === law.id ? (
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={saveEditedLaw}
                            title="Save changes"
                          >
                            <i className="bi bi-check-lg"></i> Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={cancelEdit}
                            title="Cancel editing"
                          >
                            <i className="bi bi-x-lg"></i> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditLaw(law)}
                            title="Edit this law"
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteLaw(law.id)}
                            title="Delete this law"
                          >
                            <i className="bi bi-trash"></i> Delete
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
