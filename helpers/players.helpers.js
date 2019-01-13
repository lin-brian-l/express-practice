exports.formatPlayers = function(players) {
    return players.map(player => {
        player.formattedMains = formatMains(player.mains);
        return player;
    });
}

formatMains = function(mains) {
    return mains.reduce((outputString, main, index) => {
        if (index === 0) {
            outputString = main;
        } else if (index === mains.length - 1) {
            outputString += ` and ${main}`;
        } else {
            outputString += `, ${main},`;
        }
        return outputString;
    }, "");
}