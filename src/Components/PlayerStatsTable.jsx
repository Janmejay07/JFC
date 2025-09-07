import { useState } from "react";
import { Award } from "lucide-react";
import { API_ENDPOINTS } from "../lib/config";  
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "../Components/ui/table";
import { Card } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/Input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../Components/ui/dialog";

export function PlayerStatsTable({
  players,
  onUpdateStats = null, // Default to null to avoid accidental calls
  getPlayerRating,
  isAdmin = false,
  seasonKey,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getDisplayName = (playerField) => {
    if (typeof playerField === 'string') return playerField;
    if (playerField && typeof playerField === 'object') return playerField.name || playerField.username || playerField.fullName || '';
    return '';
  };

  // Completely isolated update function - no parent dependencies
  const handlePlayerStatsUpdate = async (playerData) => {
    console.log("=== ISOLATED UPDATE FUNCTION START ===");
    console.log("Player data received:", playerData);
    
    if (!playerData || !playerData._id) {
      setError(`Player ID is missing! Received: ${JSON.stringify(playerData)}`);
      return;
    }

    setError(null);
    setSuccess(false);
    setIsUpdating(true);

    try {
      console.log("Making API call to:", `${API_ENDPOINTS.STANDINGS}/${playerData._id}`);
      
      const response = await fetch(
        `${API_ENDPOINTS.STANDINGS}/${playerData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: playerData._id,
            player: playerData.player,
            season: playerData.season || seasonKey,
            p: parseInt(playerData.p) || 0,
            w: parseInt(playerData.w) || 0,
            d: parseInt(playerData.d) || 0,
            l: parseInt(playerData.l) || 0,
            g: parseInt(playerData.g) || 0,
            a: parseInt(playerData.a) || 0,
            s: parseInt(playerData.s) || 0,
            pt: parseInt(playerData.pt) || 0,
          }),
        }
      );

      if (response.ok) {
        const updatedPlayer = await response.json();

        const updatedPlayers = players.map((player) =>
          player._id === updatedPlayer._id ? { ...updatedPlayer, season: updatedPlayer.season || seasonKey } : player
        );

        if (onUpdateStats) {
          onUpdateStats(updatedPlayers);
        }
        // notify listeners to refetch if needed
        window.dispatchEvent(new Event('standings-updated'));
        // reflect latest values in dialog immediately
        setSelectedPlayer(updatedPlayer);
        setSuccess(true);
        setError(null);
        
        // Close dialog after successful update
        setTimeout(() => {
          setSelectedPlayer(null);
          setSuccess(false);
        }, 1500);
      } else {
        const errorData = await response.text();
        setError(errorData || "Failed to update player stats");
        console.error("Error response:", errorData);
      }
    } catch (error) {
      setError("Network error while updating stats");
      console.error("Error updating stats:", error);
    } finally {
      setIsUpdating(false);
      console.log("=== ISOLATED UPDATE FUNCTION END ===");
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Player Statistics
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-14 font-semibold text-gray-700">Rank</TableHead>
            <TableHead className="font-semibold text-gray-700">Player</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">Rating</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">P</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">W</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">D</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">L</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">G</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">A</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">S</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">PTS</TableHead>
            {isAdmin && <TableHead className="w-10"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={player._id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="font-medium text-gray-500">#{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-gray-900">{getDisplayName(player.player)}</div>
                </div>
              </TableCell>
              <TableCell className="text-center text-gray-700 font-semibold">
                {getPlayerRating(player.pt)}
              </TableCell>
              <TableCell className="text-center">{player.p}</TableCell>
              <TableCell className="text-center text-green-600 font-medium">
                {player.w}
              </TableCell>
              <TableCell className="text-center text-yellow-600">{player.d}</TableCell>
              <TableCell className="text-center text-red-600">{player.l}</TableCell>
              <TableCell className="text-center text-blue-600 font-medium">{player.g}</TableCell>
              <TableCell className="text-center">{player.a}</TableCell>
              <TableCell className="text-center">{player.s}</TableCell>
              <TableCell className="text-center font-bold text-gray-900">{player.pt}</TableCell>
              {isAdmin && (
                <TableCell>
                  <Dialog open={selectedPlayer?._id === player._id} onOpenChange={(open) => {
                    if (!open) {
                      setSelectedPlayer(null);
                      setError(null);
                      setSuccess(false);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log("Trigger clicked for player:", player); // Debug log
                          setSelectedPlayer({ ...player }); // Create a copy
                          setError(null);
                          setSuccess(false);
                        }}
                      >
                        <Award className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gradient-to-r from-blue-400 to-emerald-400 p-6">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-white">
                          Update {getDisplayName(selectedPlayer?.player)}&apos;s Stats
                        </DialogTitle>
                        <DialogDescription className="text-white/90">
                          Adjust the fields below and click Update Stats to save changes.
                        </DialogDescription>
                      </DialogHeader>
                      {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                          Stats successfully updated!
                        </div>
                      )}
                      {selectedPlayer && (
                        <div className="grid grid-cols-2 gap-6 py-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Played</label>
                            <Input
                              type="number"
                              value={selectedPlayer.p}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  p: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Won</label>
                            <Input
                              type="number"
                              value={selectedPlayer.w}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  w: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">
                              Drawn
                            </label>
                            <Input
                              type="number"
                              value={selectedPlayer.d}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  d: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">
                              Lost
                            </label>
                            <Input
                              type="number"
                              value={selectedPlayer.l}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  l: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">
                              Goals
                            </label>
                            <Input
                              type="number"
                              value={selectedPlayer.g}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  g: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">
                              Assists
                            </label>
                            <Input
                              type="number"
                              value={selectedPlayer.a}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  a: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">
                              Saves
                            </label>
                            <Input
                              type="number"
                              value={selectedPlayer.s}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  s: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">
                              Points
                            </label>
                            <Input
                              type="number"
                              value={selectedPlayer.pt}
                              className="bg-white/90 border-transparent focus:ring-2 focus:ring-white"
                              onChange={(e) =>
                                setSelectedPlayer({
                                  ...selectedPlayer,
                                  pt: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <Button
                            className="col-span-2 mt-4 bg-white text-blue-600 hover:bg-white/90"
                            onClick={() => {
                              console.log("Button clicked, selectedPlayer:", selectedPlayer); // Debug log
                              if (selectedPlayer && selectedPlayer._id) {
                                handlePlayerStatsUpdate(selectedPlayer);
                              } else {
                                setError("No player selected or player ID missing");
                              }
                            }}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Update Stats"}
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}