<template>
  <q-page class="doc-page shadow-box">
    <q-table
      title="Estatísticas"
      :data="allTeams"
      :columns="columns"
      :loading="loading"
      row-key="teamId"
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
  name: 'Ranking',
  data() {
    return {
      pagination: {
        sortBy: 'rank',
      },
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
          sortable: false,
        },
        {
          name: 'killNum',
          required: true,
          label: 'Squad Kills',
          align: 'center',
          field: row => row.teamKills,
          sortable: false,
        },
        {
          name: 'rank',
          required: true,
          label: 'Posicao',
          align: 'center',
          field: row => row.rank,
          sortable: true,
        },
      ],
    };
  },
  methods: {
    exportTable() {
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.allTeams.map(row =>
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

      const status = exportFile('rankingTeams.csv', content, 'text/csv');

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
      this.allTeams = payload.teams;
      this.loading = false;
    });
  },
  destroyed() {
    this.socket.close();
  },
};
</script>
