<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="q-pa-sm">
      <q-toolbar class="text-white">
        <q-btn
          flat
          dense
          round
          class="q-mr-sm"
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-separator dark vertical inset />
        <q-toolbar-title>
          PUGB Mobile API
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item clickable exact v-ripple to="/">
          <q-item-section avatar>
            <q-icon color="primary" name="add_to_queue" />
          </q-item-section>
          <q-item-section>Controle de Overlays</q-item-section>
        </q-item>

        <q-item clickable exact v-ripple to="/statics">
          <q-item-section avatar>
            <q-icon color="primary" name="equalizer" />
          </q-item-section>
          <q-item-section>Estatísticas</q-item-section>
        </q-item>

        <q-item clickable exact v-ripple to="/ranking">
          <q-item-section avatar>
            <q-icon color="primary" name="group" />
          </q-item-section>
          <q-item-section>Ranking dos Times</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  data() {
    return {
      leftDrawerOpen: false,
      links: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: '/pagina-2',
        },
      ],
    };
  },
};
</script>
