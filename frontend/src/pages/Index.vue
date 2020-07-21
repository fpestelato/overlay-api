<template>
  <q-page style="padding-top: 60px" class="q-pa-md doc-page">
    <h2 class="doc-heading doc-h2">Overall Stats</h2>
    <div class="row items-center justify-between">
      <div class="col col-md-10">
        <q-select
          v-model="model"
          :options="options"
          label="Nome do Jogador"
          use-input
          filled
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
          <template v-if="model" v-slot:append>
            <q-icon
              name="cancel"
              @click.stop="model = null"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
      <div class="col-auto" style="text-center">
        <q-btn
          class="self-center full-width"
          size="lg"
          outline
          color="primary"
          @click="reverseBool()"
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
    <h2 class="doc-heading doc-h2">Comparativo de Players</h2>
    <div class="row justify-between items-center">
      <div class="col col-4">
        <q-select
          v-model="model"
          :options="options"
          label="Nome do Jogador"
          use-input
          filled
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
          <template v-if="model" v-slot:append>
            <q-icon
              name="cancel"
              @click.stop="model = null"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
      <div class="col col-4">
        <q-select
          v-model="model"
          :options="options"
          label="Nome do Jogador"
          use-input
          filled
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
          <template v-if="model" v-slot:append>
            <q-icon
              name="cancel"
              @click.stop="model = null"
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
      <div class="col col-2">
        <div class="col-auto" style="text-center">
          <q-btn
            class="self-center full-width"
            size="lg"
            outline
            color="primary"
            @click="reverseBool()"
          >
            <template v-if="isPlayerStatsOn" class="self-center">
              <q-spinner-radio />
            </template>
            <div v-else>
              Toggle
            </div>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import io from 'socket.io-client';

let stringOptions = [];

export default {
  name: 'PageIndex',
  data() {
    return {
      model: '',
      options: stringOptions,
      loading: false,
      isPlayerStatsOn: false,
    };
  },
  created() {
    this.socket = io('http://localhost:3000');
    this.loading = true;
    this.socket.on('update', payload => {
      this.stringOptions = payload.players.map(p => {
        return { label: p.playerName, value: p.uId };
      });
      this.allTeams = payload.teams;
      this.loading = false;
    });
  },
  methods: {
    log: console.log,
    filterFn(val, update) {
      if (val === '') {
        update(() => {
          this.options = this.stringOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.stringOptions.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1,
        );
      });
    },
    reverseBool() {
      this.isPlayerStatsOn = !this.isPlayerStatsOn;
      return this.isPlayerStatsOn;
    },
  },
};
</script>
