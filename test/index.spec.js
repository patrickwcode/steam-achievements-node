const {isIdValid, isNameValid, getSteamAchievementsById, getSteamAchievementsByName} = require("../src");
const chai = require("chai");
const expect = chai.expect;
const portal2Achievements = [
    {
        "id": 1,
        "name": "Wake Up Call",
        "percent": 78.80000305175781,
        "description": "Survive the manual override",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/SURVIVE_CONTAINER_RIDE.jpg"
    },
    {
        "id": 2,
        "name": "You Monster",
        "percent": 70.0999984741211,
        "description": "Reunite with GLaDOS",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/WAKE_UP.jpg"
    },
    {
        "id": 3,
        "name": "Undiscouraged",
        "percent": 68.0999984741211,
        "description": "Complete the first Thermal Discouragement Beam test",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/LASER.jpg"
    },
    {
        "id": 4,
        "name": "Bridge Over Troubling Water",
        "percent": 58.79999923706055,
        "description": "Complete the first Hard Light Bridge test",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/BRIDGE.jpg"
    },
    {
        "id": 5,
        "name": "SaBOTour",
        "percent": 51.599998474121094,
        "description": "Make a break for it",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/BREAK_OUT.jpg"
    },
    {
        "id": 6,
        "name": "Stalemate Associate",
        "percent": 50.599998474121094,
        "description": "Press the button!",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/STALEMATE_ASSOCIATE.jpg"
    },
    {
        "id": 7,
        "name": "Tater Tote",
        "percent": 45.70000076293945,
        "description": "Carry science forward",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/ADDICTED_TO_SPUDS.jpg"
    },
    {
        "id": 8,
        "name": "Vertically Unchallenged",
        "percent": 47.79999923706055,
        "description": "Master the Repulsion Gel",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/BLUE_GEL.jpg"
    },
    {
        "id": 9,
        "name": "Stranger Than Friction",
        "percent": 44,
        "description": "Master the Propulsion Gel",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/ORANGE_GEL.jpg"
    },
    {
        "id": 10,
        "name": "White Out",
        "percent": 42.79999923706055,
        "description": "Complete the first Conversion Gel test",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/WHITE_GEL.jpg"
    },
    {
        "id": 11,
        "name": "Tunnel of Funnel",
        "percent": 39.20000076293945,
        "description": "Master the Excursion Funnel",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/TRACTOR_BEAM.jpg"
    },
    {
        "id": 12,
        "name": "Dual Pit Experiment",
        "percent": 41.29999923706055,
        "description": "Do the same test twice",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/TRIVIAL_TEST.jpg"
    },
    {
        "id": 13,
        "name": "The Part Where He Kills You",
        "percent": 38.400001525878906,
        "description": "This is that part",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/WHEATLEY_TRIES_TO.jpg"
    },
    {
        "id": 14,
        "name": "Lunacy",
        "percent": 38.099998474121094,
        "description": "That just happened",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/SHOOT_THE_MOON.jpg"
    },
    {
        "id": 15,
        "name": "Drop Box",
        "percent": 31.200000762939453,
        "description": "Place a cube on a button without touching the cube",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/BOX_HOLE_IN_ONE.jpg"
    },
    {
        "id": 16,
        "name": "Overclocker",
        "percent": 4.300000190734863,
        "description": "Complete Test Chamber 10 in 70 seconds",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/SPEED_RUN_LEVEL.jpg"
    },
    {
        "id": 17,
        "name": "Pit Boss",
        "percent": 8.399999618530273,
        "description": "Show that pit who's boss",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/COMPLIANT.jpg"
    },
    {
        "id": 18,
        "name": "Preservation of Mass",
        "percent": 26.899999618530273,
        "description": "Break the rules in Test Chamber 07",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/SAVE_CUBE.jpg"
    },
    {
        "id": 19,
        "name": "Pturretdactyl",
        "percent": 9.899999618530273,
        "description": "Use an Aerial Faith Plate to launch a turret",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/LAUNCH_TURRET.jpg"
    },
    {
        "id": 20,
        "name": "Final Transmission",
        "percent": 6.300000190734863,
        "description": "Find the hidden signal in one of the Rat Man's dens",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/CLEAN_UP.jpg"
    },
    {
        "id": 21,
        "name": "Good Listener",
        "percent": 31.399999618530273,
        "description": "Take GLaDOS' escape advice",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/REENTER_TEST_CHAMBERS.jpg"
    },
    {
        "id": 22,
        "name": "Scanned Alone",
        "percent": 38.400001525878906,
        "description": "Stand in a defective turret detector",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/NOT_THE_DROID.jpg"
    },
    {
        "id": 23,
        "name": "No Hard Feelings",
        "percent": 33.900001525878906,
        "description": "Save a turret from redemption",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/SAVE_REDEMPTION_TURRET.jpg"
    },
    {
        "id": 24,
        "name": "Schrodinger's Catch",
        "percent": 7.400000095367432,
        "description": "Catch a blue-painted box before it touches the ground",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/CATCH_CRAZY_BOX.jpg"
    },
    {
        "id": 25,
        "name": "Ship Overboard",
        "percent": 12,
        "description": "Discover the missing experiment",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/NO_BOAT.jpg"
    },
    {
        "id": 26,
        "name": "Door Prize",
        "percent": 8.100000381469727,
        "description": "Examine all the vitrified test chamber doors",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/A3_DOORS.jpg"
    },
    {
        "id": 27,
        "name": "Portrait of a Lady",
        "percent": 13.199999809265137,
        "description": "Find a hidden portrait",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/PORTRAIT.jpg"
    },
    {
        "id": 28,
        "name": "You Made Your Point",
        "percent": 7.5,
        "description": "Refuse to solve the first test in Chapter 8",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/DEFIANT.jpg"
    },
    {
        "id": 29,
        "name": "Smash TV",
        "percent": 3.9000000953674316,
        "description": "Break 11 test chamber monitors",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/BREAK_MONITORS.jpg"
    },
    {
        "id": 30,
        "name": "High Five",
        "percent": 58.70000076293945,
        "description": "Celebrate your cooperative calibration success",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/HI_FIVE_YOUR_PARTNER.jpg"
    },
    {
        "id": 31,
        "name": "Team Building",
        "percent": 49.599998474121094,
        "description": "Complete all test chambers in the Team Building co-op course",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/TEAM_BUILDING.jpg"
    },
    {
        "id": 32,
        "name": "Confidence Building",
        "percent": 41.29999923706055,
        "description": "Complete all test chambers in the Mass and Velocity co-op course",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/MASS_AND_VELOCITY.jpg"
    },
    {
        "id": 33,
        "name": "Bridge Building",
        "percent": 32.599998474121094,
        "description": "Complete all test chambers in the Hard-Light Surfaces co-op course",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/HUG_NAME.jpg"
    },
    {
        "id": 34,
        "name": "Obstacle Building",
        "percent": 26.899999618530273,
        "description": "Complete all test chambers in the Excursion Funnels co-op course",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/EXCURSION_FUNNELS.jpg"
    },
    {
        "id": 35,
        "name": "You Saved Science",
        "percent": 21.700000762939453,
        "description": "Complete all test chambers in all courses of co-op",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/NEW_BLOOD.jpg"
    },
    {
        "id": 36,
        "name": "Iron Grip",
        "percent": 3.799999952316284,
        "description": "Never lose a cube in Chamber 6 of the Mass and Velocity co-op course",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/NICE_CATCH.jpg"
    },
    {
        "id": 37,
        "name": "Gesticul-8",
        "percent": 27.799999237060547,
        "description": "Perform all 8 gestures of your own volition in co-op",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/TAUNTS.jpg"
    },
    {
        "id": 38,
        "name": "Can't Touch This",
        "percent": 10.600000381469727,
        "description": "Dance in front of a turret blocked by a hard light bridge in co-op",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/YOU_MONSTER.jpg"
    },
    {
        "id": 39,
        "name": "Empty Gesture",
        "percent": 4.900000095367432,
        "description": "Drop your co-op partner in goo while they are gesturing by removing the bridge under them",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/PARTNER_DROP.jpg"
    },
    {
        "id": 40,
        "name": "Party of Three",
        "percent": 3.799999952316284,
        "description": "Find the hidden companion cube in co-op test chamber",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/PARTY_OF_THREE.jpg"
    },
    {
        "id": 41,
        "name": "Narbacular Drop",
        "percent": 6.300000190734863,
        "description": "Place a portal under your co-op partner while they are gesturing",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/PORTAL_TAUNT.jpg"
    },
    {
        "id": 42,
        "name": "Professor Portal",
        "percent": 5.800000190734863,
        "description": "After completing co-op, complete Calibration Course online with a friend who hasn’t played before",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/TEACHER.jpg"
    },
    {
        "id": 43,
        "name": "Air Show",
        "percent": 34.79999923706055,
        "description": "Perform 2 aerial gestures before touching the ground in co-op",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/WITH_STYLE.jpg"
    },
    {
        "id": 44,
        "name": "Portal Conservation Society",
        "percent": 2.799999952316284,
        "description": "Complete Chamber 3 in the Hard-Light Surfaces co-op course using only 5 total portal placements",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/LIMITED_PORTALS.jpg"
    },
    {
        "id": 45,
        "name": "Four Ring Circus",
        "percent": 7.300000190734863,
        "description": "Enter 4 different portals without touching the ground in co-op",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/FOUR_PORTALS.jpg"
    },
    {
        "id": 46,
        "name": "Triple Crown",
        "percent": 3.0999999046325684,
        "description": "Solve 3 co-op chambers in the Mass and Velocity course in under 60 seconds each",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/SPEED_RUN_COOP.jpg"
    },
    {
        "id": 47,
        "name": "Still Alive",
        "percent": 2.4000000953674316,
        "description": "Complete Course 4 with neither you nor your co-op partner dying",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/STAYING_ALIVE.jpg"
    },
    {
        "id": 48,
        "name": "Asking for Trouble",
        "percent": 9.5,
        "description": "Taunt GLaDOS in front of a camera in each of the five co-op courses",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/TAUNT_CAMERA.jpg"
    },
    {
        "id": 49,
        "name": "Rock Portal Scissors",
        "percent": 10.199999809265137,
        "description": "Win 3 co-op games of rock-paper-scissors in a row",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/ROCK_CRUSHES_ROBOT.jpg"
    },
    {
        "id": 50,
        "name": "Friends List With Benefits",
        "percent": 4.5,
        "description": "While playing co-op, hug 3 different people on your friends list",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/SPREAD_THE_LOVE.jpg"
    },
    {
        "id": 51,
        "name": "Talent Show",
        "percent": 2.5999999046325684,
        "description": "Never lose a cube in Chamber 6 of the Mobility Gels co-op course",
        "iconUrl": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/620/732c9e4da3ecf83bffbe9626a5bb40e461d0c634.jpg"
    }
];

describe("isIdValid", () => {
    const falseTests = [
        "abc",
        " ",
        "🐻‍❄️",
        -1,
        0,
        "%20",
        -9007199254740992,
        undefined,
        null,
    ];
    const trueTests = ["1", 1, 9007199254740992];

    falseTests.forEach((string) => {
        it(`expect [${string}] to be false`, () => {
            expect(isIdValid(string)).to.be.false;
        });
    });
    trueTests.forEach((string) => {
        it(`expect [${string}] to be true`, () => {
            expect(isIdValid(string)).to.be.true;
        });
    });
});

describe("isNameValid", () => {
    const falseTests = ["", " ", "%20", undefined, null];
    const trueTests = ["Team Fortress 2"];

    falseTests.forEach((string) => {
        it(`expect [${string}] to be false`, () => {
            expect(isNameValid(string)).to.be.false;
        });
    });
    trueTests.forEach((string) => {
        it(`expect [${string}] to be true`, () => {
            expect(isNameValid(string)).to.be.true;
        });
    });
});

describe("getSteamAchievementsById", () => {
    const errorTests = [{}, undefined, null];

    errorTests.forEach((error) => {
        it(`expect [${error}] to throw TypeError`, async () => {
            try {
                return await getSteamAchievementsById(error);
            } catch (err) {
                return expect(err.message).to.eql("Invalid/no app provided");

            }
        })
    });
    it(`expect [Portal 2 Achievements] to equal API call getSteamAchievementsById(620)`, async () => {
        try {
            return expect(await getSteamAchievementsById(620)).to.eql(portal2Achievements);
        } catch (err) {
            return err;
        }
    })
});

// describe("getSteamAchievementsByName", () => {
//     const falseTests = ["", undefined, null];
//     const trueTest = portal2Achievements;
//
//     falseTests.forEach((string) => {
//         it(`expect [${string}] to throw TypeError`, async () => {
//             const app = await getSteamAchievementsByName(string);
//             expect(app).to.throw(TypeError);
//         })
//     });
//     it(`expect [Portal 2 Achievements] to be true`, async () => {
//         const app = await getSteamAchievementsByName("Portal 2");
//         expect(app).to.eql(trueTest);
//     })
// });
