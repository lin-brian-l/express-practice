const mongo = require('../config/mongo');

const players = [
    {
        name: 'Joseph Marquez',
        tag: 'Mang0',
        sponsor: 'Cloud9',
        mains: ['Falco', 'Fox'],
        rank: 6
    },
    {
        name: 'Juan Debiedma',
        tag: 'Hungrybox',
        sponsor: 'Team Liquid',
        mains: ['Jigglypuff'],
        rank: 1
    },
    {
        name: 'Justin McGrath',
        tag: 'Plup',
        sponsor: 'Panda Global',
        mains: ['Sheik', 'Fox'],
        rank: 2
    },
    {
        name: 'Adam Lindgren',
        tag: 'Armada',
        sponsor: 'Alliance',
        mains: ['Peach', 'Fox'],
        rank: 3
    },
    {
        name: 'William Hjelte',
        tag: 'Leffen',
        sponsor: 'Team SoloMid',
        mains: ['Fox'],
        rank: 4
    },
    {
        name: 'Jason Zimmerman',
        tag: 'Mew2King',
        sponsor: 'Echo Fox',
        mains: ['Marth', "Sheik"],
        rank: 5
    }
]

exports.reseedPlayers = async function() {
    try {
        const db = await mongo.connectToDB();
        await db.collection('Players').deleteMany({});
        await db.collection('Players').insertMany(players);
        console.log('Successfully reseeded players.');
    } catch (error) {
        console.log(`error seeding players: ${error.message}`);
    }
}