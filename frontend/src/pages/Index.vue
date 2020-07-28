<template>
  <q-page class="doc-page shadow-box">
    <div class="q-pa-md shadow-2">
      <h2 class="doc-heading doc-h2 q-mt-none">Sobreviventes</h2>
      <div class="row">
        <div class="col-md-2">
          <q-btn
            class="self-center full-width"
            size="lg"
            filled
            color="warning"
            label="ativar"
            @click="toggleSurvivorsOverlay"
          />
        </div>
      </div>
      <h2 class="doc-heading doc-h2">Estatísticas gerais</h2>
      <div class="row items-center justify-between">
        <div class="col col-md-10">
          <q-select
            v-model="playerOverall"
            :options="players"
            option-value="uId"
            option-label="playerName"
            label="Nome do Jogador"
            class="q-pr-md"
            use-input
            outlined
            input-debound="0"
            @filter="filterFn"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
              </q-item>
            </template>
            <template v-if="playerOverall" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop="playerOverall = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </div>
        <div class="col col-2">
          <q-btn
            class="self-center full-width"
            size="lg"
            outline
            color="primary"
            @click="toggleOverallOverlay"
          >
            <template v-if="isPlayerStatsOn" class="self-center">
              <q-spinner-radio />
            </template>
            <div v-else>
              Ativar
            </div>
          </q-btn>
        </div>
      </div>
      <h2 class="doc-heading doc-h2">Comparativo de players</h2>
      <div class="row items-center justify-between" style="margin-bottom: 2rem">
        <div class="col col-md-5">
          <q-select
            v-model="playerComparison1"
            :options="players"
            option-value="uId"
            option-label="playerName"
            label="Nome do Jogador"
            class="q-pr-md"
            use-input
            outlined
            input-debound="0"
            @filter="filterFn"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
              </q-item>
            </template>
            <template v-if="playerComparison1" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop="playerComparison1 = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </div>
        <div class="col col-md-5">
          <q-select
            v-model="playerComparison2"
            :options="players"
            option-value="uId"
            option-label="playerName"
            label="Nome do Jogador"
            class="q-pr-md"
            use-input
            outlined
            input-debound="0"
            @filter="filterFn"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
              </q-item>
            </template>
            <template v-if="playerComparison2" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop="playerComparison2 = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
        </div>
        <div class="col-md-2">
          <q-btn
            class="self-center full-width"
            size="lg"
            outline
            color="primary"
            @click="toggleCompareOverlay"
          >
            <template v-if="isPlayerComparisonOn" class="self-center">
              <q-spinner-radio />
            </template>
            <div v-else>
              Ativar
            </div>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import io from 'socket.io-client';

let allPlayers = [];

export default {
  name: 'PageIndex',
  data() {
    return {
      playerOverall: '',
      playerComparison1: '',
      playerComparison2: '',
      players: allPlayers,
      loading: false,
      isPlayerStatsOn: false,
      isPlayerComparisonOn: false,
    };
  },
  methods: {
    log: console.log,
    filterFn(val, update) {
      if (val === '') {
        update(() => {
          this.players = this.allPlayers;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.players = this.allPlayers.filter(
          v => v.playerName.toLowerCase().indexOf(needle) > -1,
        );
      });
    },
    toggleOverallOverlay() {
      if (!this.playerOverall) return;
      this.isPlayerStatsOn = !this.isPlayerStatsOn;
      const request = {
        action: {
          name: 'OVERLAY',
          target: 'OVERALL',
        },
        data: {
          teamLogo: this.playerOverall.teamLogo,
          player: {
            name: this.playerOverall.playerName,
            kills: this.playerOverall.kills,
            avgDamage: this.playerOverall.avgDamage,
            killDistance: this.playerOverall.killDistance,
          },
        },
      };
      this.socket.emit('msgToServer', request);
      return this.isPlayerStatsOn;
    },
    toggleCompareOverlay() {
      if (!this.playerComparison1 || !this.playerComparison2) return;
      this.isPlayerComparisonOn = !this.isPlayerComparisonOn;
      const request = {
        action: {
          name: 'OVERLAY',
          target: 'PLAYERCOMPARE',
        },
        data: {
          playerOne: this.playerComparison1,
          playerTwo: this.playerComparison2,
        },
      };
      this.socket.emit('msgToServer', request);
      return this.isPlayerComaprasionOn;
    },
    toggleSurvivorsOverlay() {
      this.socket.emit('survivorsServer', '123');
    },
  },
  created() {
    this.socket = io('http://localhost:3000');
    this.loading = true;
    this.socket.on('update', payload => {
      this.allPlayers = payload.players;
      this.allTeams = payload.teams;
      this.loading = false;
    });
  },
  destroyed() {
    this.socket.close();
  },
};
</script>
