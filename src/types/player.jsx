import React from "react";
import PropTypes from "prop-types";

// Props type for the component
const PlayerCardProps = {
    playerData: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        player: PropTypes.string.isRequired,
        p: PropTypes.number.isRequired,
        w: PropTypes.number.isRequired,
        d: PropTypes.number.isRequired,
        l: PropTypes.number.isRequired,
        f: PropTypes.number.isRequired,
        a: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        s: PropTypes.number.isRequired,
        pt: PropTypes.number.isRequired,
        achievements: PropTypes.arrayOf(PropTypes.string),
        lastUpdated: PropTypes.string,
    }).isRequired,
};

// Component to display player details
const PlayerCard = ({ playerData }) => {
    return (
        <div className="border rounded-lg p-4 shadow-lg bg-white max-w-md">
            <h2 className="text-xl font-bold mb-2">{playerData.player}</h2>
            <p>
                <strong>Matches Played:</strong> {playerData.p}
            </p>
            <p>
                <strong>Wins:</strong> {playerData.w}
            </p>
            <p>
                <strong>Draws:</strong> {playerData.d}
            </p>
            <p>
                <strong>Losses:</strong> {playerData.l}
            </p>
            <p>
                <strong>Goals For:</strong> {playerData.f}
            </p>
            <p>
                <strong>Goals Against:</strong> {playerData.a}
            </p>
            <p>
                <strong>Goal Difference:</strong> {playerData.g}
            </p>
            <p>
                <strong>Shots:</strong> {playerData.s}
            </p>
            <p>
                <strong>Points:</strong> {playerData.pt}
            </p>
            {playerData.achievements && (
                <div>
                    <strong>Achievements:</strong>
                    <ul className="list-disc pl-5">
                        {playerData.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                        ))}
                    </ul>
                </div>
            )}
            {playerData.lastUpdated && (
                <p className="text-sm text-gray-500 mt-2">
                    Last Updated: {new Date(playerData.lastUpdated).toLocaleString()}
                </p>
            )}
        </div>
    );
};

PlayerCard.propTypes = PlayerCardProps;

export default PlayerCard;
