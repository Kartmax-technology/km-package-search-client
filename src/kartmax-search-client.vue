<script>
import Vue from "vue";
import vueDebounce from "vue-debounce";
import { getDirective } from "vue-debounce";

Vue.use(vueDebounce);

export default {
  data() {
    return {
      query: "",
      scroll:1
    };
  },
  directives: {
    // Please see above for arguments you can pass to this function
    debounce: getDirective(),
  },
  emits: ["receiveResponse"],
  props: ["form", "options", "infscroll"],

  watch: {
    infscroll: {
      handler: function (after, before) {
        this.scroll = this.scroll + 1;
        if(this.scroll <this.pageUpto){
          this.onSearch();
        }
      },
    },
  },
  beforeMount(){
     if(window.location.href.indexOf(`${this.options.pageurl}`)==-1){
       this.query = ''
     }
  },
  methods: {
    validateData: function (form) {
      //console.log(this.options);
      const emptyInputError = this.options.emptyInputError || false;
      form.app_id = this.options.app_id;
      let mandatory_fields = ["collection", "page", "count", "app_id"];
      if (emptyInputError) {
        mandatory_fields.push("query");
      }
      let errors = [];
      let is_valid = true;
      mandatory_fields.forEach(function (field) {
        if (!form[field]) {
          errors.push(field);
          is_valid = false;
        }
      });
      return {
        status: is_valid,
        fields: errors.join(", "),
      };
    },
    async onSearch() {
      this.form.query = this.query;
      this.form.page = this.scroll ;
      this.$emit("receiveResponse", {
        success: true,
        message: "Input query received",
        type: "input-query",
        response: this.query,
      });

      let validate = this.validateData(this.form);
      if (!validate.status) {
        this.$emit("receiveResponse", {
          success: false,
          message: "The following values are mandatory :" + validate.fields,
          type: "error",
        });
        return;
      }

      //Preparing requests & calculating response time
      try {
        const searchOpts = this.getOptions();
        const start = Date.now(); //start time
        let searchResp = await fetch(searchOpts.url, searchOpts.options)
          .then(async (response) => {
            return response.json();
          })
          .then((data) => {
            this.pageUpto = (data.totalHits/this.form.count).toFixed()
            //search request
            const totalTimeTaken = Date.now() - start; //end time
            // Work with JSON data here
            console.log("Search Response emitted");
            ///console.log(data.query);
            this.$emit("receiveResponse", {
              success: true,
              message: "Search response received",
              type: "search-results",
              response: data,
            }); //emit for response handling
            //catching response and working on it
            if (data.success) {
              // sending data to the kartmax search analytics
              //console.log("Received response time",data.responseTime);
              //console.log("Computed response time", totalTimeTaken);
              data.responseTime = totalTimeTaken;
              this.saveAnalytics(data);
            } else {
              console.error("No response received from search service");
            }
          })
          .catch((err) => {
            console.error(
              "Something went wrong while making the fetch data call."
            );
            console.log(err);
          });
      } catch (e) {
        console.error("Something went wrong while making the search call.");
        console.log(e.stackTrace);
      }
    },
    saveAnalytics(response) {
      let searchAnalytics = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryData: response.query,
          responseData: {
            responseTime: response.responseTime,
            totalHits: response.totalHits,
            uniqueId: response.uniqueId,
          },
          collection: this.form.collection,
        }),
      };

      if (response.success) {
        fetch(
          `https://search.kartmax.in/api/` +
            this.options.app_id +
            `/search/v1/analytics-record-plp`,
          searchAnalytics
        )
          .then((res) => {
            console.log(
              "%c Kartmax Search Analytics was saved",
              "background: #222; color: #bada55"
            );
          })
          .catch((err) => {
            console.error("Kartmax Search Analytics not saved");
          });
      } else {
        console.error("Kartmax Search Analytics not saved");
      }
    },
    getOptions() {
      return {
        url:
          `https://ai.kartmax.in/api/` +
          this.options.app_id +
          `/search-get/v1/plp-special?` +
          new URLSearchParams(this.form).toString(),
        options: {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        },
      };
    },
  },
};
</script>
<template>
  <input
    v-if="this.options.useDebounce"
    type="text"
    v-model="query"
    v-debounce="onSearch"
    placeholder="Search"
  />
  <input
    v-else
    type="text"
    v-model="query"
    placeholder="Search without debounce"
    v-on:keyup="onSearch"
  />
</template>
