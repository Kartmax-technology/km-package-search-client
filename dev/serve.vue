<script>
import Vue from "vue";
import SearchClient from "@/kartmax-search-client.vue";
let scroll = 200;

export default Vue.extend({
  components: {
    SearchClient,
  },

  beforeMount() {
    
    let compdata = this;
    window.addEventListener(
      "scroll",
      function (event) {
        var top = this.scrollY;
        if (top > scroll) {
          scroll = scroll + compdata.options.scrollDifference;
          compdata.infScroll = top;
        }
      },
      false
    );
  },
  methods: {
    receiveResponse(response) {
      /*
       * You can use this response to do whatever you want.
       * Such as hide and show the search results or loader
       * */
      console.log("Search emitted response received");
      this.response = response;
    },
    onEnter(){
      console.log("enter in enter event")
      this.$emit('onSearch')
    },
  },
  data() {
    return {
      infScroll: "",
      response: "",
      options: {
        app_id: "vwxhKzN1XsHCmZwNeBNy57pwOVFsXPHhRyJ0ApsB",
        emptyInputError: true,
        useDebounce: true,
        useKeyUp: false,
        scrollDifference:200,
        pageurl:'search'
      },
      form: {
        collection: "D3e2Zda3QWlDUObs0M2YEFyPUM2VRz",
        page: 1,
        count: 12,
      },
      busy: false,
    };
  },
});
</script>

<template>
  <div id="app">
    <div class="container">
      <br />
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <form>
            <div class="card-body row no-gutters align-items-center">
              <!--end of col-->
              <div class="col">
                <SearchClient
                  :placeholder="'Feel free to search'"
                  :class="'form-control form-control form-control-borderless '"
                  :id="'kartmax-search-client'"
                  :form="form"
                  :infscroll="infScroll"
                  :options="options"
                  v-on:receiveResponse="receiveResponse"
                  v-model="response"
                  ref="child"
                ></SearchClient>
              </div>
              <!--end of col-->
              <div class="col-auto">
                <button class="btn btn btn-success" type="submit" @click.prevent="$refs.child.onSearch">
                  Search
                </button>
              </div>
              <!--end of col-->
            </div>
          </form>

          <div class="card card-sm mt-2 p-2" v-if="response">
            <pre>
                {{ this.response }}
            </pre>
          </div>
        </div>
        <!--end of col-->
      </div>
    </div>
  </div>
</template>
