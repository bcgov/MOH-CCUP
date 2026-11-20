<template>
  <ProgressBar
    :routes="nitaopRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container nitaop-page pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Travel details</h1>
      <hr class="mt-0" />
      <section class="ps-md-5">
        <h2 id="health-authority-heading">Health Authority</h2>
        <p class="mb-0">Indicate the Health Authority in which the travel took place.</p>
        <hr class="mt-0" />
        <RadioComponent
          id="health-authority"
          v-model="healthAuthority"
          aria-labelledby="health-authority-heading"
          class="mt-3 ms-md-3"
          name="health-authority"
          :required="true"
          :items="healthAuthorityOptions"
          cypress-id="health-authority"
          @change="handleChangeField(v$.healthAuthority, $event, formFieldParent, store)"
        />
        <FieldError :show="v$.healthAuthority.$dirty && v$.healthAuthority.$invalid">
          Health authority is required.
        </FieldError>
      </section>

      <section class="ps-md-5">
        <h2 class="mt-4">Travel details</h2>
        <p class="mb-0">
          Enter travel details for each trip (minimum requirement: one round trip).
        </p>
        <hr class="mt-0" />
        <div class="trips mt-3 ms-md-3">
          <div
            v-for="(trip, index) in trips"
            :key="trip.id"
            class="trip"
          >
            <div
              class="trip-header d-flex flex-wrap align-items-center gap-2 ps-3 pe-3 pe-md-5 py-2"
            >
              <button
                type="button"
                class="btn btn-light btn-sm trip-toggle"
                :data-cy="`toggle-trip-${index}`"
                :aria-label="`Trip # ${index + 1}`"
                :aria-expanded="isTripExpanded(trip.id)"
                :aria-controls="`trip-body-${trip.id}`"
                @click="toggleTrip(trip.id)"
              >
                <IconChevronDown :class="{ 'chevron-up': isTripExpanded(trip.id) }" />
              </button>
              <h3 class="mb-0 ms-2">Trip # {{ index + 1 }}</h3>
              <ButtonComponent
                v-if="trips.length > 1"
                :cypress-id="`delete-trip-${index}`"
                label="Delete"
                :aria-label="`Delete Trip # ${index + 1}`"
                class="ms-auto"
                :color="'white'"
                @click="store.deleteTrip(index)"
              />
            </div>
            <!-- v-show, not v-if: a collapsed trip stays mounted so it is still validated -->
            <div
              v-show="isTripExpanded(trip.id)"
              :id="`trip-body-${trip.id}`"
              class="trip-body pb-4"
            >
              <NitaopTrip
                :prop-data="trip"
                :index="index"
              />
            </div>
          </div>
        </div>

        <ButtonComponent
          v-if="trips.length < MAX_TRIPS"
          cypress-id="add-trip"
          label="Add community"
          class="mt-4 ms-md-3"
          @click="store.addTrip()"
        />
      </section>
    </main>
  </PageContent>
  <ContinueBar
    :button-label="'Continue'"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
</template>

<script setup>
import {
  PageContent,
  RadioComponent,
  ContinueBar,
  ButtonComponent,
  IconChevronDown,
} from "common-lib-vue";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { MAX_TRIPS, useNitaopStore } from "@/stores/nitaopStore";
import { required } from "@vuelidate/validators";
import { nitaopRoutes, routes } from "@/router/index.js";
import ProgressBar from "@/components/ProgressBar.vue";
import NitaopTrip from "@/components/NitaopTrip.vue";
import FieldError from "@/components/FieldError.vue";
import pageStateService from "@/services/page-state-service.js";
import { scrollTo, scrollToError } from "@/helpers/scroll";

//the value is saved as-is and must match the MaxImage document text exactly, dashes included
const healthAuthorityOptions = [
  ["fha", "FHA – Fraser Health Authority"],
  ["iha", "IHA – Interior Health Authority"],
  ["islh", "ISLH - Island Health"],
  ["mp", "MP – Mary Pack"],
  ["nha", "NHA – Northern Health Authority"],
  ["nvhb", "NVHB – Nisga’a Valley Health Authority"],
  ["vcha", "VCHA – Vancouver Coastal Health Authority"],
  ["phsa", "PHSA - Provincial Health Services Authority"],
].map(([id, label]) => ({ id, label, value: label }));
</script>

<script>
export default {
  name: "NitaopTravelDetails",
  data() {
    return {
      v$: useVuelidate(),
      store: useNitaopStore(),
      formFieldParent: "travel",
      healthAuthority: null,
      collapsedTripIds: [],
    };
  },
  computed: {
    trips() {
      return this.store.formFields.travel.trips;
    },
  },
  created() {
    this.assignDataFromStore();
  },
  validations() {
    return {
      healthAuthority: { required },
    };
  },
  methods: {
    validatePage() {
      this.v$.$validate();

      if (this.v$.$error) {
        //open every trip so the errors in collapsed trips are visible
        this.collapsedTripIds = [];
        return scrollToError();
      }

      this.nextPage();
    },
    isTripExpanded(tripId) {
      return !this.collapsedTripIds.includes(tripId);
    },
    toggleTrip(tripId) {
      this.collapsedTripIds = this.isTripExpanded(tripId)
        ? [...this.collapsedTripIds, tripId]
        : this.collapsedTripIds.filter((id) => id !== tripId);
    },
    nextPage() {
      const toPath = routes.NITAOP_STEP_3.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    assignDataFromStore() {
      this.healthAuthority = this.store.formFields.travel.healthAuthority;
    },
  },
};
</script>

<style scoped>
.trips {
  border-top: 2px solid var(--bs-primary-nav);
}
.trip {
  border-bottom: 2px solid var(--bs-warning);
}
.trip-body {
  padding-left: 1rem;
  border-left: 2px solid var(--bs-primary);
}
.trip-toggle {
  width: 2rem;
}
@media (min-width: 768px) {
  .trip-body {
    padding-left: 4rem;
  }
}
.trip-toggle svg {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
}
.trip-toggle .chevron-up {
  transform: rotate(180deg);
}
@media (prefers-reduced-motion: reduce) {
  .trip-toggle svg {
    transition: none;
  }
}
</style>
