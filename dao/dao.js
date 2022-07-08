const mysql = require("mysql2/promise");
const bluebird = require('bluebird');
const User = require("../modul/user");
const Command = require("../modul/command");

class DAO{
    constructor() {
        this.connection=
            mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'twitch',
                Promise: bluebird
            });
    }
    getConnection(){
        return this.connection;
    }
    async getUsers(){
        let [rows, fields]=await (await this.getConnection()).execute(
            'SELECT * FROM `users`',[]);
        return rows;
    }

    async getCommand(channel,command){
        let [rows, fields]=await (await this.getConnection()).execute(
            'SELECT `result` FROM `commands`,`users` WHERE `commands`.`userid`=`users`.`id` AND `users`.`username` LIKE ? AND `commands`.`command` LIKE ?'
            ,[channel,command]);
        return rows;
    }

    async createUser(user){
        await (await this.getConnection()).execute(
            'INSERT INTO `users` (`id`,`username`,`email`,`picture`,`access_token`,`refresh_token`,`id_token`) ' +
            'VALUES (?,?,?,?,?,?,?)'
            ,[user.id,user.username,user.email,user.picture,user.access_token,user.refresh_token,user.id_token]);
    }

    async updateUser(user){
        await (await this.getConnection()).execute(
            'UPDATE `users` SET `username`=?, `email`=?, `picture`=?, `access_token`=?, `refresh_token`=?, `id_token`=? ' +
            'WHERE `id`=?'
            ,[user.username,user.email,user.picture,user.access_token,user.refresh_token,user.id_token,user.id]);
    }

    async createCommand(cmd){
        await (await this.getConnection()).execute(
            'INSERT INTO `commands` (`userid`,`command`,`result`) VALUES (?,?,?)'
            ,[cmd.userid,cmd.command,cmd.result]);
    }

    async updateCommand(cmd){
        await (await this.getConnection()).execute(
            'UPDATE  `commands` SET `result`=? WHERE `command`=? AND `userid`=?',
            [cmd.result,cmd.command,cmd.userid]);
    }

    async deleteCommand(cmd){
        await (await this.getConnection()).execute(
            'DELETE FROM `commands` WHERE `command`=? AND `userid`=?',
            [cmd.command,cmd.userid]);
    }
}
module.exports=DAO;