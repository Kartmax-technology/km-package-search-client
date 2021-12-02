<script>
import axios from 'axios';
import Vue from "vue";
import vueDebounce from 'vue-debounce';
import { getDirective } from 'vue-debounce'
Vue.use(vueDebounce);

export default {
  data() {
    return {
      query: '',
    }
  },
  directives: {
    // Please see above for arguments you can pass to this function
    debounce: getDirective()
  },
  emits: ['receiveResponse'],
  props:['form','options'],
  methods: {
    validateData: function(form) {
      //console.log(this.options);
      const emptyInputError = this.options.emptyInputError || false;
      form.app_id = this.options.app_id;
      let mandatory_fields = ['collection','page','count','app_id'];
      if(emptyInputError){
        mandatory_fields.push('query');
      }
      let errors = [];
      let is_valid = true;
      mandatory_fields.forEach(function(field) {
        if(!form[field]) {
          errors.push(field);
          is_valid = false;
        }
      });
      return {
        status : is_valid,
        fields : errors.join(', '),
      };
    },
    async onSearch() {
      this.form.query = this.query;
      let validate = this.validateData(this.form);
      if (!validate.status) {
        this.$emit('receiveResponse', {
          success: false,
          message: 'The following values are mandatory :'+validate.fields
        });
        return;
      }

      //Preparing requests & calculating response time
      const searchOpts = this.getOptions();
      const start = Date.now(); //start time
      let searchResp = await axios(searchOpts); //search request
      const totalTimeTaken = Date.now() - start; //end time
      let response = await searchResp.data; //response
      console.log("Search Response emitted");
      this.$emit('receiveResponse', response); //emit for response handling

      //catching response and working on it
      if (response) {
        // sending data to the kartmax search analytics
        response.responseTime = totalTimeTaken
        this.saveAnalytics(response);
      }else{
        console.error("No response received from search service");
      }
    },
    saveAnalytics(response) {
      let searchAnalytics = {
        queryData: response.query,
        responseData: {
          responseTime: response.responseTime,
          totalHits: response.totalHits,
          uniqueId: response.uniqueId,
        },
        collection: this.form.collection,
      };
      if (response.response.success === 1) {
        axios
            .post(
                `https://search.kartmax.in/api/`+this.options.app_id+`/search/v1/analytics-record-plp`,
                searchAnalytics
            )
            .then((res) => {
              console.log("Kartmax Search Analytics was saved");
            })
            .catch((err) => {
              console.error("Kartmax Search Analytics not saved");
            });
      }else{
        console.log("Kartmax Search Analytics not saved");
      }
    },
    getOptions() {
      return {
        method: "GET",
        url: `https://ai.kartmax.in/api/` + this.options.app_id + `/search-get/v1/plp-special`,
        headers: {
          "Content-Type": "application/json",
        },
        params: this.form,
      };
    }
  },
};
</script>
<template>
  <input type="text" v-model="query" v-debounce="onSearch" placeholder="Search"/>
</template>
