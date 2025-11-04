const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Tournament = require('./models/tournamentModel');
const Team = require('./models/teamModel');
const Player = require('./models/playerModel');
const Match = require('./models/matchModel');
const SpiritScore = require('./models/spiritScoreModel');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Tournament.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Match.deleteMany({});
    await SpiritScore.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const director = await User.create({
      name: 'Tournament Director',
      email: 'director@yultimate.com',
      password: 'password123',
      role: 'tournament_director'
    });

    const teamManager = await User.create({
      name: 'Team Manager',
      email: 'manager@yultimate.com',
      password: 'password123',
      role: 'team_manager'
    });

    const player1User = await User.create({
      name: 'John Doe',
      email: 'john@yultimate.com',
      password: 'password123',
      role: 'player'
    });

    const player2User = await User.create({
      name: 'Jane Smith',
      email: 'jane@yultimate.com',
      password: 'password123',
      role: 'player'
    });

    console.log('Created users');

    // Create players
    const player1 = await Player.create({
      user: player1User._id,
      name: 'John Doe',
      age: 25,
      gender: 'male',
      email: 'john@yultimate.com',
      experience: 'intermediate',
      yearsPlaying: 3
    });

    const player2 = await Player.create({
      user: player2User._id,
      name: 'Jane Smith',
      age: 23,
      gender: 'female',
      email: 'jane@yultimate.com',
      experience: 'advanced',
      yearsPlaying: 5
    });

    const player3 = await Player.create({
      user: player1User._id,
      name: 'Mike Johnson',
      age: 27,
      gender: 'male',
      email: 'mike@yultimate.com',
      experience: 'professional',
      yearsPlaying: 7
    });

    const player4 = await Player.create({
      user: player2User._id,
      name: 'Sarah Williams',
      age: 24,
      gender: 'female',
      email: 'sarah@yultimate.com',
      experience: 'intermediate',
      yearsPlaying: 4
    });

    console.log('Created players');

    // Create tournament
    const tournament = await Tournament.create({
      name: 'Y-Ultimate Championship 2024',
      title: 'Annual Championship',
      description: 'The premier Ultimate Frisbee tournament of the year',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-03'),
      location: 'Central Sports Complex',
      address: '123 Sports Ave, City',
      status: 'upcoming',
      maxTeams: 8,
      registrationDeadline: new Date('2024-05-15'),
      organizer: director._id,
      spiritScoreEnabled: true
    });

    console.log('Created tournament');

    // Create teams
    const team1 = await Team.create({
      name: 'Thunder Strikers',
      tournament: tournament._id,
      captain: player1._id,
      coCaptain: player2._id,
      players: [
        { player: player1._id, jerseyNumber: 7, role: 'captain' },
        { player: player2._id, jerseyNumber: 10, role: 'coCaptain' }
      ],
      status: 'approved',
      registeredBy: teamManager._id,
      jerseyColors: { primary: 'Blue', secondary: 'White' }
    });

    const team2 = await Team.create({
      name: 'Lightning Bolts',
      tournament: tournament._id,
      captain: player3._id,
      coCaptain: player4._id,
      players: [
        { player: player3._id, jerseyNumber: 9, role: 'captain' },
        { player: player4._id, jerseyNumber: 11, role: 'coCaptain' }
      ],
      status: 'approved',
      registeredBy: teamManager._id,
      jerseyColors: { primary: 'Red', secondary: 'Black' }
    });

    console.log('Created teams');

    // Add teams to tournament
    tournament.teams.push(team1._id, team2._id);
    await tournament.save();

    // Create a match
    const match = await Match.create({
      tournament: tournament._id,
      field: 'Field 1',
      fieldNumber: 1,
      team1: team1._id,
      team2: team2._id,
      startTime: new Date('2024-06-01T10:00:00'),
      endTime: new Date('2024-06-01T11:30:00'),
      status: 'scheduled',
      round: 'pool'
    });

    // Add match to tournament
    tournament.matches.push(match._id);
    await tournament.save();

    console.log('Created match');

    // Create spirit scores
    const spiritScore1 = await SpiritScore.create({
      match: match._id,
      submittedBy: team1._id,
      submittedFor: team2._id,
      rulesKnowledge: 3,
      foulsAndBody: 4,
      fairMindedness: 3,
      positiveAttitude: 4,
      communication: 3,
      comments: 'Great sportsmanship and fair play!'
    });

    const spiritScore2 = await SpiritScore.create({
      match: match._id,
      submittedBy: team2._id,
      submittedFor: team1._id,
      rulesKnowledge: 4,
      foulsAndBody: 3,
      fairMindedness: 4,
      positiveAttitude: 3,
      communication: 4,
      comments: 'Excellent team spirit and communication.'
    });

    console.log('Created spirit scores');

    console.log('\n✅ Sample data created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Tournament Director:');
    console.log('  Email: director@yultimate.com');
    console.log('  Password: password123');
    console.log('\nTeam Manager:');
    console.log('  Email: manager@yultimate.com');
    console.log('  Password: password123');
    console.log('\nPlayer:');
    console.log('  Email: john@yultimate.com');
    console.log('  Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());

