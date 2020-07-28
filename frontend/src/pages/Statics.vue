<template>
  <q-page class="q-pa-lg">
    <q-table
      title="Estatísticas"
      class="my-sticky-header-table"
      :data="allPlayers"
      :columns="columns"
      :loading="loading"
      row-key="uId"
      style="height: 1060px"
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
        sortBy: 'kills',
        descending: true,
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
          name: 'headShotNum',
          required: true,
          label: 'Headshots',
          align: 'center',
          field: row => row.killNumByGrenade,
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
          name: 'rescueTimes',
          required: true,
          label: 'Rescue Times',
          align: 'center',
          field: row => row.rescueTimes,
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
          name: 'survivalTime',
          required: true,
          label: 'Survival Time',
          align: 'center',
          field: row => row.survivalTime,
          sortable: true,
        },
        {
          name: 'maxKillDistance',
          required: true,
          label: 'Max Kill Distance',
          align: 'center',
          field: row => row.maxKillDistance,
          sortable: true,
        },
        {
          name: 'inDamage',
          required: true,
          label: 'In Damage',
          align: 'center',
          field: row => row.inDamage,
          sortable: true,
        },
        {
          name: 'marchDistance',
          required: true,
          label: 'March Distance',
          align: 'center',
          field: row => row.marchDistance,
          sortable: true,
        },
        {
          name: 'killNumInVehicle',
          required: true,
          label: 'Kills in Vehicle',
          align: 'center',
          field: row => row.killNumInVehicle,
          sortable: true,
        },
        {
          name: 'killNumByGrenade',
          required: true,
          label: 'Kills By Grenade',
          align: 'center',
          field: row => row.killNumByGrenade,
          sortable: true,
        },
        {
          name: 'useFragGrenadeNum',
          required: true,
          label: 'Frag Grenades Used',
          align: 'center',
          field: row => row.useFragGrenadeNum,
          sortable: true,
        },
        {
          name: 'useSmokeGrenadeNum',
          required: true,
          label: 'Smoke Grenades Used',
          align: 'center',
          field: row => row.useSmokeGrenadeNum,
          sortable: true,
        },
      ],
    };
  },
  methods: {
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

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #FFFFFF

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
