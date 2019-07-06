const conn = require('../db.js');
const { check, validationResult } = require('express-validator');

// @Title APIDocs
// @Description Describes the API
// @Accept plain
// @Produce json
// @Router /api/ [get]
exports.api = function (req, res, next) {
    var secretArray = JSON.parse(req.app.get('secret'))
    var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    if (!shouldShow) {
        throw "naughty"
    }

    res.json({
        'api': {
            'version': '1.0',
            'description': 'API Homepage',
            'author': 'sillypears',
            'email': 'sillypairs@gmail.com',
            'path': '/api'
        }
    })
};

exports.getUsersSearch = function (req, res, next) {
    var secretArray = JSON.parse(req.app.get('secret'))
    var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    if (!shouldShow) {
        throw "naughty"
    }

    let getUserSql = `
    SELECT
        u.user_id,
        u.twitch_name,
        u.discord_name,
        u.discord_id,
        u.timezone,
        u.user_info    
    FROM
        necrobot.users u
    WHERE
        u.discord_name IS NOT null
    ORDER BY
        u.user_id 
        ASC
    `
    conn.query(getUserSql, function (error, results, fields) {
        if (error) {
            res.json({
                'error': {
                    'status_code': -2,
                    'message': error,
                }
            });

        } else {
            let users = []
            for(let i = 0, len = results.length; i < len; i++) {
                if (results[i]["twitch_name"] !== null) {
                    users.push(results[i]["twitch_name"])
                } else {
                    users.push(results[i]["discord_name"])
                }
            }
            res.send(
                users
            );
        }
    });
};

exports.getUserStats = function (req, res, next) {
    var secretArray = JSON.parse(req.app.get('secret'))
    var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    if (!shouldShow) {
        throw "naughty"
    }
    let userName = req.params.user
    let getUserStatsSql = `
    SELECT 
        r.race_id,
        rr.time,
        rr.rank,
        rr.igt,
        rr.comment,
        rr.level,
        r.seed,
        rt.character,
        r.timestamp
    FROM
        race_runs rr
            LEFT JOIN
        necrobot.users u ON rr.user_id = u.user_id
            LEFT JOIN
        races r ON rr.race_id = r.race_id
            LEFT JOIN
        race_types rt ON r.type_id = rt.type_id
    WHERE
        u.twitch_name = '` + userName + `'
        OR u.discord_name = '` + userName + `'
    ORDER BY
        r.timestamp 
        DESC
    LIMIT 10
    `
    conn.query(getUserStatsSql, function (error, results, fields) {
        if (error) {
            res.json({
                'error': {
                    'status_code': -2,
                    'message': error
                }
            });

        } else {
            res.send(
                results
            );
        }
    });
};

exports.getLastTwentyRaces = function(req, res, next) {
    var secretArray = JSON.parse(req.app.get('secret'))
    var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    if (!shouldShow) {
        throw "naughty"
    }

    let getLastRacesSql = `
    SELECT 
        r.race_id as r_id, 
        r.timestamp, 
        r.seed, 
        rt.character,
        rt.descriptor,
        (SELECT GROUP_CONCAT(u.twitch_name) FROM race_runs rr  LEFT JOIN races r ON r.race_id = rr.race_id LEFT JOIN users u ON u.user_id = rr.user_id WHERE rr.race_id = r_id) as racers,
        (SELECT GROUP_CONCAT(u.discord_name) FROM race_runs rr  LEFT JOIN races r ON r.race_id = rr.race_id LEFT JOIN users u ON u.user_id = rr.user_id WHERE rr.race_id = r_id) as racers_discord
    FROM
        races r
    LEFT JOIN
        race_types rt ON rt.type_id = r.type_id
    LEFT JOIN
        race_runs rr ON rr.race_id = r.race_id
    WHERE
        r.private = 0
    GROUP BY r_id
    ORDER BY r.timestamp DESC
    LIMIT 50`
    conn.query(getLastRacesSql, function(error, results, fields){
        if (error) {
            res.json({
                'error': {
                    'status_code': -3,
                    'message': error
                }
            });
        } else {
            res.send(
                results
            )
        }
    });
};

exports.getRaceInfo = function(req, res, next) {
    var secretArray = JSON.parse(req.app.get('secret'))
    var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    if (!shouldShow) {
        throw "naughty"
    }

    let getRaceSql = `
    SELECT
        rr.race_id,
        r.timestamp,
        rr.time,
        rr.rank,
        rr.igt,
        r.seed,
        rr.level,
        rr.comment,
        u.twitch_name,
        u.discord_name,
        rt.descriptor
    FROM
        race_runs rr
            LEFT JOIN
        users u ON u.user_id = rr.user_id
            LEFT JOIN
        races r ON rr.race_id = r.race_id
            LEFT JOIN
        race_types rt ON r.type_id = rt.type_id
    WHERE
        rr.race_id = '` + req.params.race + `'
        AND r.private = 0
    ORDER BY rank ASC`
    conn.query(getRaceSql, function(error, results, fields){
        if (error) {
            res.json({
                'error': {
                    'status_code': -3,
                    'message': error
                }
            });
        } else {
            res.send(
                results
            )
        }
    });
};