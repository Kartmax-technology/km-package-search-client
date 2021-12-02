<script>
import Vue from 'vue';
import kartmax_search_client from '@/kartmax-search-client.vue';

export default Vue.extend({
  name: 'ServeDev',
  methods : {
    async onSearch(query) {
      await kartmax_search_client.methods.init(query).then(function(result) {
        console.log("Response",result);
      });
    }
  },
  data() {
    return {
      query: '',
    }
  },
});
</script>

<template>
  <div id="app">
    <input type="text" v-model="query" @keyup="onSearch(query)" placeholder="Search"/>
  </div>
</template>
