import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/api';
import { formatProjectPrice } from '../utils/format';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects({ limit: 50, offset: 0 });
                setProjects(data.results || []);
            } catch (error) {
                console.error("Failed to load projects", error);
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Builder Projects</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map(project => {
                        const isCrore = project.price_min && project.price_min < 10; // Simple heuristic as prices are raw numbers 1-5 (Cr) or 10-100 (L)
                        return (
                            <div key={project.project_id} className="bg-white rounded-lg shadow-sm border p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-xl">{project.apartment_name}</h3>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full uppercase font-medium">{project.project_status}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">By {project.developer_name} • {project.locality}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider">Price Range</div>
                                            <div className="font-medium">{formatProjectPrice(project.price_min, isCrore)} - {formatProjectPrice(project.price_max, isCrore)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider">Area Range</div>
                                            <div className="font-medium">{project.min_area_sqft} - {project.max_area_sqft} sqft</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default Projects;