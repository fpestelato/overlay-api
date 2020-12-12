import { Injectable, HttpService } from '@nestjs/common'
import { AppGateway } from './app.gateway'

@Injectable()
export class AppService {
  public _playerInfoList = []
  public _teamInfoList = []
  private _lastEightId = []
  private _deadTeamsQueue = []
  private _deadTeamsAlreadyExhibitedIds = []
  private _teamsJson = require('./teams.json')

  constructor(
    private readonly httpService: HttpService,
    private readonly appGateway: AppGateway,
  ) {
    this.pullData()
  }

  playerInfoList() {
    let data = { players: [], teams: [] }
    data.players = this._playerInfoList.map(p => {
      let teamInfo = this._teamInfoList.find(t => t.teamId === p.teamId)
      let teamMisc = this._teamsJson.teams.find(t => t.id === p.teamId)

      return {
        uId: p.uId,
        playerName: p.playerName,
        kills: p.killNum,
        avgDamage: p.damage,
        killDistance: p.maxKillDistance,
        squadKills: teamInfo.killNum,
        teamId: p.teamId,
        teamLogo: teamMisc ? teamMisc.logoPicUrl : '',
        teamName: teamMisc ? teamMisc.teamName : '',
        rank: p.rank,
        assists: p.assists,
        knockouts: p.knockouts,
        heal: p.heal,
        rescueTimes: p.rescueTimes,
        driveDistance: p.driveDistance,
        survivalTime: p.survivalTime,
        maxKillDistance: p.maxKillDistance,
        inDamage: p.inDamage,
        marchDistance: p.marchDistance,
        killNumInVehicle: p.killNumInVehicle,
        killNumByGrenade: p.killNumByGrenade,
        headShotNum: p.headShotNum,
        useFragGrenadeNum: p.useFragGrenadeNum,
        useSmokeGrenadeNum: p.useSmokeGrenadeNum,
      }
    })

    data.teams = this._teamInfoList.map(t => {
      let teamMisc = this._teamsJson.teams.find(
        jsonTeam => jsonTeam.id === t.teamId,
      )

      return {
        teamName: teamMisc?.teamName || 'SEM NOME',
        teamLogo: teamMisc?.logoPicUrl || 'assets/teams/loops.png',
        rank: data.players.find(p => p.teamId == t.teamId)?.rank,
        teamKills: t.killNum,
      }
    })

    this.appGateway.updateData(data)
  }

  updateSurvivors() {
    if (this._lastEightId.length === 0) {
      let aliveTeams = this._teamInfoList.filter(t => t.liveMemberNum > 0)

      if (aliveTeams.length <= 8) {
        this._lastEightId = aliveTeams.map(t => t.teamId)
        this.appGateway.toggleSurvivorsVisibility()
      }
    } else {
      let data = this._teamInfoList.filter(t =>
        this._lastEightId.includes(t.teamId),
      )
      data = data.map(d => {
        let teamMisc = this._teamsJson.teams.find(t => t.id === d.teamId)

        return {
          logoPicUrl: teamMisc?.logoPicUrl || 'assets/teams/loops.png',
          teamId: d.teamId,
          teamName: teamMisc?.teamName || 'SEM NOME',
          killNum: d.killNum,
          liveMemberNum: d.liveMemberNum,
        }
      })

      this.appGateway.updateSurvivors(data)
    }
  }

  async showDeadTeams() {
    let deadTeams = this._teamInfoList.filter(t => t.liveMemberNum === 0)

    deadTeams.forEach(t => {
      if (!this._deadTeamsQueue.find(dt => dt.teamId === t.teamId)) {
        this._deadTeamsQueue.push({ ...t, exhibited: false })
      }
    })

    let notExhibitedTeam = this._deadTeamsQueue.find(
      dt => dt.exhibited === false,
    )

    if (notExhibitedTeam) {
      let notExhibitedTeamId = notExhibitedTeam.teamId
      let teamMisc = this._teamsJson.teams.find(
        t => t.id === notExhibitedTeamId,
      )

      let data = {
        position:
          this._playerInfoList.find(p => p.teamId === notExhibitedTeamId)
            ?.rank || 0,
        teamLogo: teamMisc?.logoPicUrl || 'assets/teams/loops.png',
        teamName: teamMisc?.teamName || 'SEM NOME',
      }

      const teamIndex = this._deadTeamsQueue.findIndex(
        dt => dt.teamId === notExhibitedTeamId,
      )

      this._deadTeamsQueue[teamIndex].exhibited = true
      this._deadTeamsAlreadyExhibitedIds.push(notExhibitedTeamId)

      if (data.position !== 0) {
        this.appGateway.handleEliminatedTeam(data)
      }
    }
  }

  pullData = async function() {
    // let playerInfoList = await this.httpService
    //   .post('http://192.168.0.27:10086/gettotalplayerlist')
    //   .toPromise()
    // let teamInfoList = await this.httpService
    //   .post('http://192.168.0.27:10086/getteaminfolist')
    //   .toPromise()
    // this._playerInfoList = playerInfoList.data.playerInfoList
    // this._teamInfoList = teamInfoList.data.teamInfoList

    let playerInfoList = await this.httpService
      .post('http://localhost:3040/playerInfoList')
      .toPromise()
    let teamInfoList = await this.httpService
      .post('http://localhost:3040/teamInfoList')
      .toPromise()
    // this._playerInfoList = playerInfoList.data
    // this._teamInfoList = teamInfoList.data


    this._playerInfoList = playerInfoList.data.playerInfoList
    this._teamInfoList = teamInfoList.data.teamInfoList

    console.log('reciving data from the api...')

    setTimeout(async () => {
      this.playerInfoList()
      this.updateSurvivors()
      await this.showDeadTeams()
      this.pullData()
    }, 2000)
  }
}
