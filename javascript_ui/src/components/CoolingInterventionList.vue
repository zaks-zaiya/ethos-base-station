<template>
  <q-card>
    <q-card-section class="row items-center q-pb-none">
      <div class="text-bold fontsize-20">Cooling Strategies</div>
      <q-space />
      <q-btn icon="close" color="primary" class="fontsize-12" v-close-popup>
        Close
      </q-btn>
    </q-card-section>
    <q-card-section>
      <div class="fontsize-16">
        If you need to lower your body temperature, here are the best ways to do
        it (click on a row for more info):
      </div>
      <q-table
        :rows="coolingStrategies"
        class="large-font my-sticky-header-table"
        row-key="name"
        :pagination="pagination"
        :columns="columns"
        @row-click="onRowClick"
        hide-bottom
      >
        <template v-slot:body-cell-icon="props">
          <q-td :props="props">
            <q-icon :name="props.row.icon" size="60px" color="grey" />
          </q-td>
        </template>

        <template v-slot:body-cell-effectiveness="props">
          <q-td :props="props">
            <CoolingInterventionEffectiveness
              :effectiveness="props.row.effectiveness"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CoolingStrategy } from 'src/components/models';
import { coolingStrategies } from 'src/helper/coolingStrategies';
import { QTableProps } from 'quasar';
import CoolingInterventionEffectiveness from './CoolingInterventionEffectiveness.vue';

export default defineComponent({
  name: 'CoolingInterventionList',
  components: { CoolingInterventionEffectiveness },
  setup(props, { emit }) {
    const onRowClick = (evt: Event, row: CoolingStrategy) => {
      emit('show-info', row);
    };
    const pagination = {
      rowsPerPage: 0,
      sortBy: 'effectiveness',
      descending: true,
    };
    const columns: QTableProps['columns'] = [
      {
        name: 'icon',
        required: true,
        label: '',
        align: 'left',
        field: 'icon',
        format: (val: string) => `<img src="${val}" alt="" />`,
      },
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: 'name',
      },
      {
        name: 'effectiveness',
        required: true,
        sortable: true,
        label: 'Potential Effectiveness',
        align: 'left',
        field: 'effectiveness',
      },
    ];
    return { onRowClick, coolingStrategies, columns, pagination };
  },
});
</script>

<style lang="scss">
.large-font {
  tbody td,
  thead th {
    font-size: 26px;
  }
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh / 1.5);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: $grey-3;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
</style>
