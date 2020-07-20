<template>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'PageIndex',
  data(){
    return {
      loading: false,
    }
  },
  created(){
    // this.socket = io("http://localhost:3000");

    // this.loading = true;

    // this.socket.on('update', (payload)=> {
    //                 this.allPlayers = payload.players;
    //                 this.allTeams = payload.teams;

    //                 this.loading = false;
    //             });
  },
  methods: {
    log: console.log
  }
}
</script>
