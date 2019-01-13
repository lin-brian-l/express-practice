exports.formatPlayers = function(players) {
    return players.map(player => {
        player.formattedMains = exports.formatMains(player.mains);
        player.formattedTag = formatTags(player.sponsor, player.tag);
        return player;
    });
}

formatTags = function(sponsor, tag) {
    if (sponsor) {
        return `${sponsor} | ${tag}`;
    } else {
        return tag;
    }
}

exports.formatMains = function(mains) {
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

exports.formatFormMains = function(formInput) {
    return formInput.split(' ').map(mains => {
        return mains.replace(/,/g, '');
    });
};