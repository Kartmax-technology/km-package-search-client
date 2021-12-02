<script>
import Vue from 'vue';
import SearchClient from '@/kartmax-search-client.vue';

export default Vue.extend({
  components: {
    SearchClient
  },
  methods : {
     receiveResponse(response) {
       /*
       * You can use this response to do whatever you want.
       * Such as hide and show the search results or loader
       * */
        console.log(response);
        this.response = response;
    }
  },
  data() {
    return {
      response: '',
      options:{
        app_id: 'r9phKuPML3NTZSCiiINdELAkP8hzxjZkqUPiI6FG',
        emptyInputError: true,
      },
      form:{
        collection : "K50qtol4isMqmdFjz6xnWCFz5oAc3s",
        page :1,
        count : 12,
      }
    }
  },
});
</script>

<template>
  <div id="app">
    <div class="container">
      <br/>
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <form>
            <div class="card-body row no-gutters align-items-center">
              <div class="col-auto">
                <i class="fas fa-search h4 text-body"></i>
              </div>
              <!--end of col-->
              <div class="col">
                <SearchClient
                    :placeholder="'Feel free to search'"
                    :class="'form-control form-control-lg form-control-borderless'"
                    :form="form"
                    :options="options"
                    v-on:receiveResponse="receiveResponse"
                    v-model="response"
                >
                </SearchClient>
              </div>
              <!--end of col-->
              <div class="col-auto">
                <button class="btn btn-lg btn-success" type="submit">Search</button>
              </div>
              <!--end of col-->
            </div>
          </form>

          <div class="card card-sm mt-2 p-2" v-if="response">
            <pre>
                {{this.response}}
            </pre>
          </div>
        </div>
        <!--end of col-->
      </div>
    </div>
  </div>
</template>
