import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Edit, Plus, Trash, Clock, MapPin, XCircle, ArrowLeft, User, Crown, ShieldCheck, Trophy } from "lucide-react";
import { InlineLoading } from "../Components/ui/Loading";

// Import your actual config and axios
import { API_ENDPOINTS } from "../lib/config";
import axios from "axios";

const UpcomingMatchesSection = () => {
	const [upcomingMatches, setUpcomingMatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const [editMatch, setEditMatch] = useState(null);
	const [formData, setFormData] = useState({
		homeTeam: '',
		awayTeam: '',
		date: '',
		venue: '',
		jfcLineup: [],
		opponentLineup: []
	});
	const [showForm, setShowForm] = useState(false);
	const [selectedMatch, setSelectedMatch] = useState(null);
	const [newPlayer, setNewPlayer] = useState({ name: '', position: '' });
	
	// New state for "Complete Match" functionality
	const [showCompleteForm, setShowCompleteForm] = useState(false);
	const [completeFormData, setCompleteFormData] = useState({
		jfcScore: 0,
		opponentScore: 0,
		mvp: '',
		goalScorers: []
	});

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
				setError('Session expired. Please log in again.');
			}
			setUserRole(null);
		}
	};

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const [, matchesResponse] = await Promise.all([
				fetchUserData(),
				axios.get(API_ENDPOINTS.UPCOMING_MATCHES)
			]);
			
			if (matchesResponse && matchesResponse.data) {
				const filteredMatches = matchesResponse.data.filter(
					(match) => new Date(match.date) > new Date()
				);
				setUpcomingMatches(filteredMatches || []);
			} else {
				setUpcomingMatches([]);
			}
		} catch (err) {
			console.error('Fetch error:', err);
			setError('Failed to fetch upcoming matches.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 60000);
		return () => clearInterval(interval);
	}, [fetchData]);

	const handleMatchClick = (match) => {
		setSelectedMatch(match);
	};

	const handleBackToList = () => {
		setSelectedMatch(null);
	};

	const handleEditMatch = (match) => {
		setEditMatch(match._id);
		setFormData({
			homeTeam: match.homeTeam,
			awayTeam: match.awayTeam,
			date: new Date(match.date).toISOString().slice(0, 16),
			venue: match.venue,
			jfcLineup: match.jfcLineup || [],
			opponentLineup: match.opponentLineup || []
		});
		setShowForm(true);
	};

	const handleAddMatch = () => {
		setEditMatch('new');
		setFormData({
			homeTeam: '',
			awayTeam: '',
			date: '',
			venue: '',
			jfcLineup: [],
			opponentLineup: []
		});
		setShowForm(true);
		setError(null);
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleNewPlayerChange = (e) => {
		const { name, value } = e.target;
		setNewPlayer({ ...newPlayer, [name]: value });
	};

	const handleAddPlayerToTeam = (teamKey) => (e) => {
		e.preventDefault();
		if (!newPlayer.name || !newPlayer.position) {
			setError('Please enter player name and position.');
			return;
		}
		const updatedLineup = [...formData[teamKey], { name: newPlayer.name, position: newPlayer.position }];
		setFormData({ ...formData, [teamKey]: updatedLineup });
		setNewPlayer({ name: '', position: '' });
		setError(null);
	};

	const handleRemovePlayer = (team, index) => {
		if (team === 'jfcLineup') {
			const updatedLineup = formData.jfcLineup.filter((_, i) => i !== index);
			setFormData({ ...formData, jfcLineup: updatedLineup });
		} else {
			const updatedLineup = formData.opponentLineup.filter((_, i) => i !== index);
			setFormData({ ...formData, opponentLineup: updatedLineup });
		}
	};

	const handleSetCaptain = (team, index) => {
		let lineup = formData[team];
		const playerToPromote = lineup[index];

		const updatedLineup = lineup.map(p => ({
			...p,
			isCaptain: p.name === playerToPromote.name && p.position === playerToPromote.position ? true : false,
			isViceCaptain: p.name === playerToPromote.name && p.position === playerToPromote.position ? false : p.isViceCaptain,
		}));
		setFormData({ ...formData, [team]: updatedLineup });
	};

	const handleSetViceCaptain = (team, index) => {
		let lineup = formData[team];
		const playerToPromote = lineup[index];

		const updatedLineup = lineup.map(p => ({
			...p,
			isViceCaptain: p.name === playerToPromote.name && p.position === playerToPromote.position ? true : false,
			isCaptain: p.name === playerToPromote.name && p.position === playerToPromote.position ? false : p.isCaptain,
		}));
		setFormData({ ...formData, [team]: updatedLineup });
	};
	
	// New functions for "Complete Match"
	const handleMarkAsCompleted = (match) => {
		setSelectedMatch(match);
		setCompleteFormData({
			jfcScore: 0,
			opponentScore: 0,
			mvp: '',
			goalScorers: [],
			upcomingMatchId: match._id,
			homeTeam: match.homeTeam,
			awayTeam: match.awayTeam,
			date: match.date,
			venue: match.venue,
			jfcLineup: match.jfcLineup,
			opponentLineup: match.opponentLineup
		});
		setShowCompleteForm(true);
	};

	const handleCompleteFormChange = (e) => {
		const { name, value } = e.target;
		setCompleteFormData({ ...completeFormData, [name]: value });
	};

	const handleGoalScorerChange = (playerName) => {
		setCompleteFormData(prevState => {
			const isScorer = prevState.goalScorers.includes(playerName);
			if (isScorer) {
				return {
					...prevState,
					goalScorers: prevState.goalScorers.filter(name => name !== playerName)
				};
			} else {
				return {
					...prevState,
					goalScorers: [...prevState.goalScorers, playerName]
				};
			}
		});
	};

	const handleCompleteSubmit = async (e) => {
		e.preventDefault();
		try {
			const headers = getAuthHeaders();
			const { upcomingMatchId, ...dataToSend } = completeFormData;

			// Send POST request to the correct completed matches API
			await axios.post(API_ENDPOINTS.MATCHES, dataToSend, { headers });
			
			// Delete the upcoming match from the old collection
			await axios.delete(`${API_ENDPOINTS.UPCOMING_MATCHES}/${upcomingMatchId}`, { headers });

			setError('Match marked as completed and moved successfully!');
			setShowCompleteForm(false);
			setSelectedMatch(null); 
			fetchData();
		} catch (err) {
			console.error('Complete match error:', err);
			setError('Failed to complete match. Please try again.');
		}
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			const headers = getAuthHeaders();
			if (editMatch === 'new') {
				await axios.post(API_ENDPOINTS.UPCOMING_MATCHES, formData, { headers });
			} else {
				await axios.put(`${API_ENDPOINTS.UPCOMING_MATCHES}/${editMatch}`, formData, { headers });
			}
			setError('Match saved successfully!');
			setEditMatch(null);
			setShowForm(false);
			await fetchData();
		} catch (err) {
			console.error('Form submit error:', err);
			if (err.response?.status === 403) {
				setError('Permission denied. Only admins can perform this action.');
			} else if (err.response?.status >= 400 && err.response?.status < 500) {
				setError(`Request error: ${err.response.data?.message || 'Please check your input and try again.'}`);
			} else {
				setError(`Failed to save match: ${err.message || 'Please try again.'}`);
			}
		}
	};

	const handleDeleteMatch = async (matchId) => {
		try {
			await axios.delete(`${API_ENDPOINTS.UPCOMING_MATCHES}/${matchId}`, {
				headers: getAuthHeaders()
			});
			setError('Match deleted successfully!');
			await fetchData();
		} catch (err) {
			console.error('Delete error:', err);
			if (err.response?.status === 403) {
				setError('Permission denied. Only admins can delete matches.');
			} else if (err.response?.status >= 400 && err.response?.status < 500) {
				setError(`Request error: ${err.response.data?.message || 'Failed to delete match.'}`);
			} else {
				setError(`Failed to delete match: ${err.message || 'Please try again.'}`);
			}
		}
	};

	const handleCloseForm = () => {
		setEditMatch(null);
		setShowForm(false);
		setError(null);
	};

	const handleCloseCompleteForm = () => {
		setShowCompleteForm(false);
		setCompleteFormData({
			jfcScore: 0,
			opponentScore: 0,
			mvp: '',
			goalScorers: []
		});
		setSelectedMatch(null);
	};

	if (loading) {
		return (
			<div className="text-center text-white py-8">
				<InlineLoading 
					variant="white" 
					message="Loading upcoming matches..." 
				/>
			</div>
		);
	}

	const hasUpcomingMatches = upcomingMatches.length > 0;

	if (showCompleteForm) {
		return (
			<section className="py-12 px-4 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
				<div className="max-w-4xl mx-auto space-y-6">
					<button
						onClick={handleCloseCompleteForm}
						className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" /> Go Back to List
					</button>
					<div className="bg-gray-800/50 p-8 rounded-lg backdrop-blur-sm relative">
						<h4 className="text-2xl font-bold text-white mb-6">Complete Match: {completeFormData.homeTeam} vs {completeFormData.awayTeam}</h4>
						{error && (
							<div className={`mb-4 p-4 rounded-md bg-red-800 text-red-200`}>
								{error}
							</div>
						)}
						<form onSubmit={handleCompleteSubmit} className="space-y-6">
							<div className="flex items-center gap-4">
								<div className="w-1/2">
									<label htmlFor="jfcScore" className="block text-sm font-medium text-gray-400">JFC Score</label>
									<input
										type="number"
										id="jfcScore"
										name="jfcScore"
										value={completeFormData.jfcScore}
										onChange={handleCompleteFormChange}
										className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
										required
									/>
								</div>
								<div className="w-1/2">
									<label htmlFor="opponentScore" className="block text-sm font-medium text-gray-400">Opponent Score</label>
									<input
										type="number"
										id="opponentScore"
										name="opponentScore"
										value={completeFormData.opponentScore}
										onChange={handleCompleteFormChange}
										className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
										required
									/>
								</div>
							</div>
							
							<div>
								<label htmlFor="mvp" className="block text-sm font-medium text-gray-400">MVP (Most Valuable Player)</label>
								<input
									type="text"
									id="mvp"
									name="mvp"
									value={completeFormData.mvp}
									onChange={handleCompleteFormChange}
									className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
									required
								/>
							</div>

							<div>
								<h5 className="text-lg font-medium text-gray-400 mb-2">Goal Scorers (JFC)</h5>
								<div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
									{completeFormData.jfcLineup.map((player, index) => (
										<label key={index} className="flex items-center space-x-2 text-gray-300">
											<input
												type="checkbox"
												checked={completeFormData.goalScorers.includes(player.name)}
												onChange={() => handleGoalScorerChange(player.name)}
												className="form-checkbox h-4 w-4 text-blue-600"
											/>
											<span>{player.name}</span>
										</label>
									))}
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
							>
								Submit Match Results
							</button>
						</form>
					</div>
				</div>
			</section>
		)
	}

	if (selectedMatch) {
		return (
			<section className="py-12 px-4 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
				<div className="max-w-4xl mx-auto space-y-6">
					<button
						onClick={handleBackToList}
						className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" /> Go Back to List
					</button>
					<div className="bg-gray-800/50 p-8 rounded-lg backdrop-blur-sm">
						<h3 className="text-3xl font-bold text-gray-200">
							{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
						</h3>
						<div className="flex items-center gap-4 mt-4 text-gray-300">
							<span className="flex items-center">
								<Calendar className="w-5 h-5 mr-2 text-blue-400" />
								{new Date(selectedMatch.date).toLocaleDateString()}
							</span>
							<span className="flex items-center">
								<Clock className="w-5 h-5 mr-2 text-blue-400" />
								{new Date(selectedMatch.date).toLocaleTimeString()}
							</span>
							<span className="flex items-center">
								<MapPin className="w-5 h-5 mr-2 text-blue-400" />
								{selectedMatch.venue}
							</span>
						</div>
						<div className="mt-8 space-y-6">
							<div>
								<h4 className="text-2xl font-bold text-white mb-4">Lineup</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<div>
										<h5 className="text-xl font-semibold text-blue-400 mb-2">{selectedMatch.homeTeam} Lineup</h5>
										<ul className="text-gray-300 space-y-1">
											{selectedMatch.jfcLineup && selectedMatch.jfcLineup.map((player, index) => (
												<li key={index} className="flex items-center">
													{player.name} ({player.position})
													{player.isCaptain && <Crown className="w-4 h-4 text-yellow-500 ml-2" />}
													{player.isViceCaptain && <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />}
												</li>
											))}
										</ul>
									</div>
									<div>
										<h5 className="text-xl font-semibold text-emerald-400 mb-2">{selectedMatch.awayTeam} Lineup</h5>
										<ul className="text-gray-300 space-y-1">
											{selectedMatch.opponentLineup && selectedMatch.opponentLineup.map((player, index) => (
												<li key={index} className="flex items-center">
													{player.name} ({player.position})
													{player.isCaptain && <Crown className="w-4 h-4 text-yellow-500 ml-2" />}
													{player.isViceCaptain && <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className="py-24 px-4 bg-gradient-to-br from-gray-900 to-blue-900">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between gap-3 mb-12">
					<div className="flex items-center gap-3">
						<Calendar className="w-8 h-8 text-blue-400" />
						<h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
							Upcoming Matches
						</h3>
					</div>
					{userRole === 'admin' && (
						<button
							onClick={handleAddMatch}
							className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							<Plus className="w-5 h-5 mr-2" /> Add Match
						</button>
					)}
				</div>

				{error && (
					<div className={`mb-4 p-4 rounded-md ${error.includes('successfully') ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
						{error}
					</div>
				)}

				{showForm && (
					<div className="mb-8 p-8 bg-gray-800/50 rounded-lg backdrop-blur-sm relative">
						<button
							onClick={handleCloseForm}
							className="absolute top-4 right-4 text-gray-400 hover:text-white"
						>
							<XCircle className="h-6 w-6" />
						</button>
						<h4 className="text-2xl font-bold text-white mb-6">{editMatch === 'new' ? 'Add New Match' : 'Edit Match'}</h4>
						<div className="space-y-4">
							<div>
								<label htmlFor="homeTeam" className="block text-sm font-medium text-gray-400">Home Team</label>
								<input
									type="text"
									id="homeTeam"
									name="homeTeam"
									value={formData.homeTeam}
									onChange={handleFormChange}
									className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
									required
								/>
							</div>
							<div>
								<label htmlFor="awayTeam" className="block text-sm font-medium text-gray-400">Away Team</label>
								<input
									type="text"
									id="awayTeam"
									name="awayTeam"
									value={formData.awayTeam}
									onChange={handleFormChange}
									className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
									required
								/>
							</div>
							 <div>
								<label htmlFor="date" className="block text-sm font-medium text-gray-400">Date & Time</label>
								<input
									type="datetime-local"
									id="date"
									name="date"
									value={formData.date}
									onChange={handleFormChange}
									className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
									required
								/>
							</div>
							 <div>
								<label htmlFor="venue" className="block text-sm font-medium text-gray-400">Venue</label>
								<input
									type="text"
									id="venue"
									name="venue"
									value={formData.venue}
									onChange={handleFormChange}
									className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
									required
								/>
							</div>
							
							<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="bg-gray-800/40 rounded-md p-4">
									<h5 className="text-xl font-bold text-blue-400 mb-4">{formData.homeTeam || 'Home'} Lineup</h5>
									<div className="space-y-3">
										<div>
											<label htmlFor="homePlayerName" className="block text-sm font-medium text-gray-400">Player Name</label>
											<input
												type="text"
												id="homePlayerName"
												name="name"
												value={newPlayer.name}
												onChange={handleNewPlayerChange}
												className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
												placeholder="e.g., John Doe"
											/>
										</div>
										<div>
											<label htmlFor="homePlayerPosition" className="block text-sm font-medium text-gray-400">Position/Role</label>
											<input
												type="text"
												id="homePlayerPosition"
												name="position"
												value={newPlayer.position}
												onChange={handleNewPlayerChange}
												className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
												placeholder="e.g., Forward, Midfielder"
											/>
										</div>
										<button
											onClick={handleAddPlayerToTeam('jfcLineup')}
											className="flex items-center justify-center w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
										>
											<Plus className="w-5 h-5 mr-2" /> Add to {formData.homeTeam || 'Home'}
										</button>
										<ul className="text-gray-300 space-y-2 mt-3">
											{formData.jfcLineup.map((player, index) => (
												<li key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
													<div className="flex items-center">
														<User className="w-4 h-4 mr-2 text-blue-400" />
														<span>{player.name} ({player.position})</span>
														{player.isCaptain && <Crown className="w-4 h-4 text-yellow-500 ml-2" />}
														{player.isViceCaptain && <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />}
													</div>
													<div className="flex items-center gap-2">
														<button onClick={() => handleSetCaptain('jfcLineup', index)} title="Set as Captain">
															<Crown className="w-5 h-5 text-yellow-500 hover:text-yellow-400" />
														</button>
														<button onClick={() => handleSetViceCaptain('jfcLineup', index)} title="Set as Vice Captain">
															<ShieldCheck className="w-5 h-5 text-green-500 hover:text-green-400" />
														</button>
														<button onClick={() => handleRemovePlayer('jfcLineup', index)} title="Remove Player">
															<Trash className="w-5 h-5 text-red-500 hover:text-red-400" />
														</button>
													</div>
												</li>
											))}
										</ul>
									</div>
								</div>

								<div className="bg-gray-800/40 rounded-md p-4">
									<h5 className="text-xl font-bold text-emerald-400 mb-4">{formData.awayTeam || 'Away'} Lineup</h5>
									<div className="space-y-3">
										<div>
											<label htmlFor="awayPlayerName" className="block text-sm font-medium text-gray-400">Player Name</label>
											<input
												type="text"
												id="awayPlayerName"
												name="name"
												value={newPlayer.name}
												onChange={handleNewPlayerChange}
												className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
												placeholder="e.g., Alex Smith"
											/>
										</div>
										<div>
											<label htmlFor="awayPlayerPosition" className="block text-sm font-medium text-gray-400">Position/Role</label>
											<input
												type="text"
												id="awayPlayerPosition"
												name="position"
												value={newPlayer.position}
												onChange={handleNewPlayerChange}
												className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md shadow-sm p-2"
												placeholder="e.g., Defender, Striker"
											/>
										</div>
										<button
											onClick={handleAddPlayerToTeam('opponentLineup')}
											className="flex items-center justify-center w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
										>
											<Plus className="w-5 h-5 mr-2" /> Add to {formData.awayTeam || 'Away'}
										</button>
										<ul className="text-gray-300 space-y-2 mt-3">
											{formData.opponentLineup.map((player, index) => (
												<li key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
													<div className="flex items-center">
														<User className="w-4 h-4 mr-2 text-emerald-400" />
														<span>{player.name} ({player.position})</span>
														{player.isCaptain && <Crown className="w-4 h-4 text-yellow-500 ml-2" />}
														{player.isViceCaptain && <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />}
													</div>
													<div className="flex items-center gap-2">
														<button onClick={() => handleSetCaptain('opponentLineup', index)} title="Set as Captain">
															<Crown className="w-5 h-5 text-yellow-500 hover:text-yellow-400" />
														</button>
														<button onClick={() => handleSetViceCaptain('opponentLineup', index)} title="Set as Vice Captain">
															<ShieldCheck className="w-5 h-5 text-green-500 hover:text-green-400" />
														</button>
														<button onClick={() => handleRemovePlayer('opponentLineup', index)} title="Remove Player">
															<Trash className="w-5 h-5 text-red-500 hover:text-red-400" />
														</button>
													</div>
												</li>
											))}
										</ul>
									</div>
								</div>
								
								<button
									onClick={handleFormSubmit}
									className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-6"
								>
									{editMatch === 'new' ? 'Add Match' : 'Save Changes'}
								</button>
						</div>
						</div>
					</div>
				)}

				{!hasUpcomingMatches ? (
					<p className="text-center text-gray-400">No upcoming matches scheduled at the moment.</p>
				) : (
					<div className="space-y-6">
						{upcomingMatches.map((match) => (
							<div
								key={match._id}
								onClick={() => handleMatchClick(match)}
								className="relative group cursor-pointer"
							>
								<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
								<div className="relative bg-gray-800/50 p-8 rounded-lg backdrop-blur-sm transform group-hover:scale-[1.02] transition duration-500">
									<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
										<div>
											<h4 className="text-xl font-bold text-gray-200">
												{match.homeTeam} vs {match.awayTeam}
											</h4>
										</div>
										<div className="mt-4 md:mt-0 flex items-center gap-4 text-gray-300">
											<span className="flex items-center">
												<Calendar className="w-5 h-5 mr-2 text-blue-400" />
												{new Date(match.date).toLocaleDateString()}
											</span>
											<span className="flex items-center">
												<MapPin className="w-5 h-5 mr-2 text-blue-400" />
												{match.venue}
											</span>
										</div>
										{userRole === 'admin' && (
											<div className="mt-4 flex flex-wrap gap-3">
												<button
													onClick={(e) => { e.stopPropagation(); handleEditMatch(match); }}
													className="flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
												>
													<Edit className="w-4 h-4 mr-2" /> Edit
													</button>
													<button
														onClick={(e) => { e.stopPropagation(); handleDeleteMatch(match._id); }}
													className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
												>
													<Trash className="w-4 h-4 mr-2" /> Delete
													</button>
													<button
														onClick={(e) => { e.stopPropagation(); handleMarkAsCompleted(match); }}
													className="flex items-center px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
												>
													<Trophy className="w-4 h-4 mr-2" /> Complete
													</button>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default UpcomingMatchesSection;