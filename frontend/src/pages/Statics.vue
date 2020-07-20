<template>
  <q-page class="flex flex-center">
  <q-table
      title="Estatísticas"
      :data="allPlayers"
      :columns="columns"
      :loading="loading"
      :pagination="initialPagination"
      row-key="uId"
    >
      <template v-slot:body-cell-teamLogo="props">
        <q-td :props="props">
          <q-img :src="`${props.row.teamLogo}`" :ratio="1"/>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'Statics',
  data(){
    return {
      initialPagination: {
        sortBy: 'kills',
        descending: false,
        page: 1,
        rowsPerPage: 50
        // rowsNumber: xx if getting data from a server
      },
      allPlayers: [],
      allTeams: [],
      loading: false,
      columns: [
         {
           name: 'teamLogo',
           required: false,
           label: 'Logo',
           align: 'center',
           sortable: false
         },
         {
           name: 'teamName',
           required: true,
           label: 'Time',
           align: 'center',
           field: row => row.teamName,
           sortable: true
         },
        {
          name: 'playerName',
          required: true,
          label: 'Player',
          align: 'center',
          field: row => row.playerName,
          sortable: true
        },
        {
          name: 'kills',
          required: true,
          label: 'Kills',
          align: 'center',
          field: row => row.kills,
          sortable: true
        },
        {
          name: 'assists',
          required: true,
          label: 'Assists',
          align: 'center',
          field: row => row.assists,
          sortable: true
        },
        {
          name: 'knockouts',
          required: true,
          label: 'Knockouts',
          align: 'center',
          field: row => row.knockouts,
          sortable: true
        },
        {
          name: 'avgDamage',
          required: true,
          label: 'Damage',
          align: 'center',
          field: row => row.avgDamage,
          sortable: true
        },
        {
          name: 'heal',
          required: true,
          label: 'Heal',
          align: 'center',
          field: row => row.heal,
          sortable: true
        },
        {
          name: 'revives',
          required: true,
          label: 'Revives',
          align: 'center',
          field: row => row.revives,
          sortable: true
        },
        {
          name: 'driveDistance',
          required: true,
          label: 'Drive Distance',
          align: 'center',
          field: row => row.driveDistance,
          sortable: true
        },
        {
          name: 'surviceTime',
          required: true,
          label: 'Survice Time',
          align: 'center',
          field: row => row.surviceTime,
          sortable: true
        },
      ],
    }
  },
  created(){
    this.socket = io("http://localhost:3000");

    this.loading = true;

    this.socket.on('update', (payload)=> {
                    this.allPlayers = payload.players;
                    this.allTeams = payload.teams;
                    this.loading = false;

                    this.log(this.allPlayers);
                });
  },
  methods: {
    log: console.log
  }
}
</script>
