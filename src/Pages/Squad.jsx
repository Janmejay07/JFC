import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SkillBar from "../Components/SkillBar";
import { FullPageLoading } from "../Components/ui/Loading";
import { API_ENDPOINTS } from "../lib/config";
import axios from "axios"; // Import axios for POST request
import { Users, Calendar, Award, TrendingUp, Star, Clock, Plus, XCircle, User } from "lucide-react";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return {};
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

function Squad() {
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        age: '',
        dob: '',
        bio: '',
        image: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState({ name: '', percentage: '' });

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(API_ENDPOINTS.PLAYER_PROFILES);
            setPlayers(response.data);
        } catch (error) {
            console.error("Error fetching player data:", error);
            setError("Failed to load player data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUserRole(null);
            return;
        }

        try {
            const userResponse = await axios.get(API_ENDPOINTS.PROFILE, {
                headers: getAuthHeaders()
            });
            setUserRole(userResponse.data.role);
        } catch (authErr) {
            console.error('Auth error:', authErr);
            if (authErr.response?.status === 401) {
                localStorage.removeItem('token');
            }
            setUserRole(null);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchPlayers();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillChange = (e) => {
        const { name, value } = e.target;
        setNewSkill({ ...newSkill, [name]: value });
    };

    const handleAddSkill = () => {
        if (newSkill.name && newSkill.percentage) {
            setFormData({
                ...formData,
                skills: [...formData.skills, { ...newSkill, percentage: parseInt(newSkill.percentage) }]
            });
            setNewSkill({ name: '', percentage: '' });
        }
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: updatedSkills });
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_ENDPOINTS.PLAYER_PROFILES, formData, { headers: getAuthHeaders() });
            setShowAddForm(false);
            setFormData({ name: '', position: '', age: '', dob: '', bio: '', image: '', skills: [] });
            fetchPlayers(); // Refresh the list of players
        } catch (err) {
            console.error('Failed to add player:', err);
            setError('Failed to add player. Check permissions and data.');
        }
    };

    if (loading) {
        return (
            <FullPageLoading 
                variant="light" 
                message="Loading Squad..." 
            />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-xl font-semibold mb-2">
                        Error Loading Players
                    </div>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-24 mb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 shadow-2xl">
                            <Users className="h-12 w-12 text-yellow-400" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                        MY ELITE SQUAD
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Meet the extraordinary athletes who define excellence, embodying
                        skill, dedication, and team spirit on every play.
                    </p>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center mx-auto px-6 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" /> Add New Player
                        </button>
                    )}
                </div>
            </div>

            {/* Add Player Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XCircle className="h-8 w-8" />
                        </button>
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Add New Player</h2>
                        <form onSubmit={handleAddPlayer} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleFormChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Date of Birth</label>
                                    <input
                                        type="text"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleFormChange}
                                        required
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Biography</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleFormChange}
                                    required
                                    rows="3"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">Skills</h3>
                                <div className="flex space-x-2 mb-2">
                                    <input
                                        type="text"
                                        name="name"
                                        value={newSkill.name}
                                        onChange={handleSkillChange}
                                        placeholder="Skill Name"
                                        className="flex-grow border-gray-300 rounded-md p-2"
                                    />
                                    <input
                                        type="number"
                                        name="percentage"
                                        value={newSkill.percentage}
                                        onChange={handleSkillChange}
                                        placeholder="Percentage"
                                        className="w-24 border-gray-300 rounded-md p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {formData.skills.map((skill, index) => (
                                        <li key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                                            <span>{skill.name}: {skill.percentage}%</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Add Player
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Squad Stats */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 backdrop-blur-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-3xl font-black">{players.length}</div>
                            <div className="text-sm text-gray-600">Active Players</div>
                        </div>
                        <div className="text-center">
                            <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-3xl font-black">87%</div>
                            <div className="text-sm text-gray-600">Avg. Skill Level</div>
                        </div>
                        <div className="text-center">
                            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-3xl font-black">15</div>
                            <div className="text-sm text-gray-600">Wins This Season</div>
                        </div>
                        <div className="text-center">
                            <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-3xl font-black">4.8</div>
                            <div className="text-sm text-gray-600">Team Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Players Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="space-y-8">
                    {players.map((player) => (
                        <div
                            key={player._id}
                            className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden"
                        >
                            <div className="md:flex">
                                {/* Player Image */}
                                <div className="md:w-2/5 overflow-hidden group">
                                    <img
                                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                        src={API_ENDPOINTS.getPlayerImage(player.image)}
                                        alt={player.name}
                                    />
                                </div>

                                {/* Player Details */}
                                <div className="md:w-3/5 p-8 lg:p-12">
                                    <h2 className="text-4xl font-black text-gray-900 mb-3">
                                        {player.name}
                                    </h2>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                                            {player.position}
                                        </span>
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span className="text-sm">Age {player.age}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-blue-50 p-6 rounded-2xl border">
                                            <Calendar className="h-4 w-4 text-blue-600 mb-2" />
                                            <p className="text-sm font-bold">Date of Birth</p>
                                            <p className="text-lg font-black">{player.dob}</p>
                                        </div>
                                        <div className="bg-blue-50 p-6 rounded-2xl border">
                                            <TrendingUp className="h-4 w-4 text-blue-600 mb-2" />
                                            <p className="text-sm font-bold">Experience</p>
                                            <p className="text-lg font-black">
                                                {player.age - 18} years
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-2xl border mb-8">
                                        <h3 className="text-xl font-black mb-2">Biography</h3>
                                        <p className="text-gray-700">{player.bio}</p>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-2xl border">
                                        <h3 className="text-xl font-black mb-4">Performance</h3>
                                        {player.skills.map((skill, i) => (
                                            <SkillBar
                                                key={i}
                                                name={skill.name}
                                                percentage={skill.percentage}
                                                delay={i * 200}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Squad;