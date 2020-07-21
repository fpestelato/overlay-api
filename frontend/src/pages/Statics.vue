<template>
  <q-page class="q-pa-lg">
    <q-table
      title="Estatísticas"
      :data="allPlayers"
      :columns="columns"
      :loading="loading"
      row-key="uId"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-teamLogo="props">
        <q-td :props="props">
          <q-img :src="`${props.row.teamLogo}`" :ratio="1" />
        </q-td>
      </template>

      <template v-slot:top-right>
        <q-btn
          color="positive"
          icon-right="archive"
          label="Exportar"
          no-caps
          @click="exportTable"
        />
      </template>
    </q-table>
  </q-page>
</template>

<script>
import io from 'socket.io-client';
import { exportFile } from 'quasar';

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  name: 'Statics',
  data() {
    return {
      pagination: {
        rowsPerPage: 0,
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
          sortable: false,
        },
        {
          name: 'teamName',
          required: true,
          label: 'Time',
          align: 'center',
          field: row => row.teamName,
          sortable: true,
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player',
          align: 'center',
          field: row => row.playerName,
          sortable: true,
        },
        {
          name: 'kills',
          required: true,
          label: 'Kills',
          align: 'center',
          field: row => row.kills,
          sortable: true,
        },
        {
          name: 'assists',
          required: true,
          label: 'Assists',
          align: 'center',
          field: row => row.assists,
          sortable: true,
        },
        {
          name: 'knockouts',
          required: true,
          label: 'Knockouts',
          align: 'center',
          field: row => row.knockouts,
          sortable: true,
        },
        {
          name: 'avgDamage',
          required: true,
          label: 'Damage',
          align: 'center',
          field: row => row.avgDamage,
          sortable: true,
        },
        {
          name: 'heal',
          required: true,
          label: 'Heal',
          align: 'center',
          field: row => row.heal,
          sortable: true,
        },
        {
          name: 'revives',
          required: true,
          label: 'Revives',
          align: 'center',
          field: row => row.revives,
          sortable: true,
        },
        {
          name: 'driveDistance',
          required: true,
          label: 'Drive Distance',
          align: 'center',
          field: row => row.driveDistance,
          sortable: true,
        },
        {
          name: 'surviceTime',
          required: true,
          label: 'Survice Time',
          align: 'center',
          field: row => row.surviceTime,
          sortable: true,
        },
      ],
    };
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
  methods: {
    log: console.log,
    exportTable() {
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.allPlayers.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                ),
              )
              .join(','),
          ),
        )
        .join('\r\n');

      const status = exportFile('table-export.csv', content, 'text/csv');

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning',
        });
      }
    },
  },
};
</script>

<style lang="scss">
.stats {
  min-height: 100%;
}
</style>
