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
      <div class="row">
        <div class="col-4 q-pr-lg">
          <CoolingInterventionFanBlinds />
        </div>
        <div class="table-container col-8">
          <q-table
            ref="tableRef"
            :rows="coolingStrategiesList"
            class="my-sticky-header-table"
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
          <q-avatar
            icon="arrow_upward"
            size="xl"
            color="primary"
            text-color="white"
            class="scroll-indicator-top"
            v-show="showTopScrollIndicator"
            @click="scrollTo(0)"
          />
          <q-avatar
            icon="arrow_downward"
            size="xl"
            color="primary"
            text-color="white"
            class="scroll-indicator-bottom"
            v-show="showBottomScrollIndicator"
            @click="scrollTo(1)"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { CoolingStrategy } from 'src/components/models';
import { coolingStrategies } from 'src/helpers/coolingStrategies';
import { QTable, QTableProps } from 'quasar';
import CoolingInterventionEffectiveness from './CoolingInterventionEffectiveness.vue';
import CoolingInterventionFanBlinds from './CoolingInterventionFanBlinds.vue';

export default defineComponent({
  name: 'CoolingInterventionList',
  components: {
    CoolingInterventionEffectiveness,
    CoolingInterventionFanBlinds,
  },
  setup(props, { emit }) {
    const dataPreferencesStore = useDataPreferencesStore();
    const showBottomScrollIndicator = ref(false);
    const showTopScrollIndicator = ref(false);
    const tableRef: Ref<null | QTable> = ref(null);
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
        label: 'Potential Effectiveness',
        align: 'left',
        field: 'effectiveness',
      },
    ];

    // Get cooling strategies from those avaliable
    const coolingStrategiesList = computed(() => {
      return dataPreferencesStore.coolingStrategiesAvailable.map((key) => {
        return coolingStrategies[key];
      });
    });

    onMounted(() => {
      const table = tableRef.value?.$el;
      if (table) {
        const tableBody = table.querySelector('.q-table__middle.scroll');
        if (tableBody && tableBody.clientHeight < tableBody.scrollHeight) {
          // If there is scrollable content
          showBottomScrollIndicator.value = true;
          tableBody.addEventListener('scroll', handleScroll);
        }
      }
    });

    onBeforeUnmount(() => {
      const table = tableRef.value?.$el;
      if (table) {
        const tableBody = table.querySelector('.q-table__middle.scroll');
        if (tableBody) {
          tableBody.removeEventListener('scroll', handleScroll);
        }
      }
    });

    const handleScroll = (event: UIEvent) => {
      const target = event.target as HTMLElement;
      if (target) {
        showBottomScrollIndicator.value =
          target.scrollTop + target.clientHeight < target.scrollHeight - 10;
        showTopScrollIndicator.value = target.scrollTop > 10;
      }
    };

    const scrollTo = (percent: number) => {
      const table = tableRef.value?.$el;
      if (!table) {
        return;
      }
      const tableBody = table.querySelector('.q-table__middle.scroll');
      if (tableBody) {
        const start = tableBody.scrollTop;
        const end = percent * tableBody.scrollHeight;
        const change = end - start;
        const duration = 200; // Duration in ms
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = elapsedTime / duration;

          tableBody.scrollTop = start + change * easeInOutQuad(progress);

          if (progress < 1) {
            window.requestAnimationFrame(animateScroll);
          }
        };

        const easeInOutQuad = (t: number) => {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        window.requestAnimationFrame(animateScroll);
      }
    };

    const onRowClick = (evt: Event, row: CoolingStrategy) => {
      emit('show-info', row);
    };

    return {
      coolingStrategiesList,
      columns,
      pagination,
      tableRef,
      showBottomScrollIndicator,
      showTopScrollIndicator,
      onRowClick,
      scrollTo,
    };
  },
});
</script>

<style lang="scss" scoped>
.table-container {
  position: relative; // This allows absolute positioning of children
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh / 1.5);
}
</style>
