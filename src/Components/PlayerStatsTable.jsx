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
  DialogClose,
} from "../Components/ui/dialog";

export function PlayerStatsTable({
  players,
  onUpdateStats,
  getPlayerRating,
  isAdmin = false,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // For success message

  const handleUpdateStats = async (playerData) => {
    if (!playerData?._id) {
      setError("Player ID is missing!");
      return;
    }

    setError(null); // Reset error state before new request
    setSuccess(false); // Reset success message before request

    try {
      const response = await fetch(
        API_ENDPOINTS.STANDINGS(playerData._id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: playerData._id,
            player: playerData.player,
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

        // Update the local state of players
        const updatedPlayers = players.map((player) =>
          player._id === updatedPlayer._id ? updatedPlayer : player
        );

        // Notify the parent component of the update (if needed)
        onUpdateStats(updatedPlayers);

        setSuccess(true); // Set success message
        setError(null); // Clear error message
      } else {
        const errorData = await response.text();
        setError(errorData || "Failed to update player stats");
        console.error("Error response:", errorData);
      }
    } catch (error) {
      setError("Network error while updating stats");
      console.error("Error updating stats:", error);
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
                  <div className="font-semibold text-gray-900">{player.player}</div>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPlayer(player);
                          setError(null); // Reset error when opening dialog
                          setSuccess(false); // Reset success message when opening dialog
                        }}
                      >
                        <Award className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gradient-to-r from-blue-400 to-emerald-400 p-6">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-white">
                          Update {selectedPlayer?.player}'s Stats
                        </DialogTitle>
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
                          {/* Form Fields for Player Stats */}
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
                          {/* Additional fields here (d, l, g, a, s, pt) */}
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
                          <DialogClose asChild>
                            <Button
                              className="col-span-2 mt-4 bg-white text-blue-600 hover:bg-white/90"
                              onClick={() => {
                                handleUpdateStats(selectedPlayer);
                              }}
                            >
                              Update Stats
                            </Button>
                          </DialogClose>
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
