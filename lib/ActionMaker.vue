<template>
  <div class="content">
      <div class="toolbar etched-border">
          <button type="button" title="New Library"><img src="icons/new.png"/></button>
          <input id="file-input" class="hidden" type="file" accept=".lgl,.lib"/>
          <button type="button" title="Open Library" v-on:click="loadLibrary"><img src="icons/open.png"/></button>
          <button type="button" title="Import Actions"><img src="icons/import.png"/></button>
          <span class="spacer"></span>
          <div class="dropdown">
              <button type="button" title="Save Library"><img src="icons/save.png"/></button>
              <div class="dropdown-content">
                  <a href="#">GameMaker (*.lib)</a>
                  <a href="#">LateralGM (*.lgl)</a>
              </div>
          </div>
          <span class="spacer"></span>
          <button type="button" title="Help" onclick="window.open('http://github.com/RobertBColton/ActionMaker/wiki', '_blank')"><img src="icons/help.png"/></button>
      </div>
      <div class="center">
          <div class="library-properties padded etched-border">
              <div>
                  <div class="flex-block">
                      <label>Caption:</label>
                      <input type="text"/>
                  </div>
                  <div class="flex-block">
                      <label>Id:</label>
                      <input type="text"/>
                  </div>
              </div>
              <div class="toolbar toolbar-centered padded">
                  <button type="button" title="Information"><img src="icons/info.png"/></button>
                  <button type="button" title="Initialization Code"><img src="icons/script.png"/></button>
                  <button type="button" title="Random Id"><img src="icons/tag.png"/></button>
                  <label><input type="checkbox">Advanced</label>
              </div>
              <select
                      name="action-list"
                      size="20">
                  <option v-for="action in actions" value="Move2">{{action.name}}</option>
              </select>
              <div class="toolbar toolbar-centered padded">
                  <button type="button" title="Add"><img src="icons/add.png"/></button>
                  <button type="button" title="Delete"><img src="icons/delete.png"/></button>
                  <button type="button" title="Duplicate"><img src="icons/copy.png"/></button>
                  <button type="button" title="Shift Up"><img src="icons/up.png"/></button>
                  <button type="button" title="Shift Down"><img src="icons/down.png"/></button>
              </div>
          </div>
          <div class="action-properties padded etched-border">
              <fieldset class="padded">
                  <legend>General Action Properties</legend>
                  <table>
                      <tr>
                          <td><label>Name:</label></td>
                          <td><input type="text"/></td>
                          <td><label>Description:</label></td>
                          <td><input type="text"/></td>
                      </tr>
                      <tr>
                          <td><label>Id:</label></td>
                          <td><input type="text"/></td>
                          <td><label>List text:</label></td>
                          <td><input type="text"/></td>
                      </tr>
                      <tr>
                          <td><label>Image:</label></td>
                          <td>
                              <div class="inline-flex">
                                  <img class="image-preview etched-border padded" src="icons/blank-tile.png"/>
                                  <input id="iconfile-input" class="hidden" type="file" accept="image/*"/>
                                  <span class="spacer"></span>
                                  <button type="button" title="Change Image" onclick="document.getElementById('iconfile-input').click();"><img src="icons/open.png"/></button>
                              </div>
                          </td>
                          <td><label>Hint text:</label></td>
                          <td><input type="text"/></td>
                      </tr>
                      <tr>
                          <td><label>Kind:</label></td>
                          <td>
                              <select>
                                  <option value="">Normal</option>
                                  <option value="">Begin Group</option>
                                  <option value="">End Group</option>
                                  <option value="">Else</option>
                                  <option value="">Exit</option>
                                  <option value="">Repeat</option>
                                  <option value="">Variable</option>
                                  <option value="">Code</option>
                                  <option value="">- Placeholder</option>
                                  <option value="">- Separator</option>
                                  <option value="">- Label</option>
                              </select>
                          </td>
                          <td colspan="2">
                              <div class="inline-flex-block toolbar toolbar-centered padded">
                                  <label><input type="checkbox">Hidden</label>
                                  <label><input type="checkbox">Advanced</label>
                                  <label><input type="checkbox">Pro Edition Only</label>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td><label>Execution:</label></td>
                          <td>
                              <select>
                                  <option value="">None</option>
                                  <option value="">Function</option>
                                  <option value="">Code</option>
                              </select>
                          </td>
                          <td><label>Function:</label></td>
                          <td><input type="text"/></td>
                      </tr>
                  </table>
              </fieldset>
              <fieldset class="padded">
                  <legend>Interface</legend>
                  <div class="inline-block">
                     <div class="flex-block">
                          <label>Kind:</label>
                          <select>
                              <option value="">Normal</option>
                              <option value="">None</option>
                              <option value="">Arrows</option>
                              <option value="">Code</option>
                              <option value="">Text</option>
                          </select>
                      </div>
                      <div class="padded">
                          <label><input type="checkbox">Question</label>
                          <label><input type="checkbox">Show "Apply To"</label>
                          <label><input type="checkbox">Show "Relative"</label>
                      </div>
                  </div>
                  <div class="inline-block">
                  </div>
              </fieldset>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      actions: [
        { name: 'Learn JavaScript' },
        { name: 'Learn Vue' },
        { name: 'Build something awesome' }
      ],
      loadLibrary: () => {
        this.actions[0].name = "Heller";
      }
    };
  },
}
</script>

<style>
body {
    height: 100%;
    display: flex;
}

.etched-border {
    border-color: #dfdfdf #bebebe #bebebe #dfdfdf;
    border-style: solid;
    border-width: 1px;
}

.padded {
    padding: 10px;
}

.toolbar {
    padding: 5px;
    display: flex;
    align-items: center;
}

.content > .toolbar {
    background: linear-gradient(#efefef 75%, #dedede 100%);
}

button {
    padding: 2px;
}

button > img {
    display: block;
}

.content {
    margin: auto;
    background-color: #fafafa;
}

.spacer {
    width: 10px;
    display: inline-block;
}

.center {
    display: flex;
}

.toolbar-centered {
    justify-content: center;
}

.action-properties {
    display: inline-block;
}

.library-properties {
    display: inline-block;
}

#action-list {
    width: 100%;
}

label {
    display: block;
}

.toolbar > label {
    display: inline-block;
    white-space: nowrap;
}

.flex-block {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 5px;
}

fieldset {
    margin-bottom: 5px;
}

.inline-flex {
    display: inline-flex;
    align-items: center;
}

.flex-block > label {
    margin-left: auto;
    margin-right: 5px;
    text-align: right;
}

option {
    background-image: url(icons/blank-tile.png);
    background-repeat: no-repeat;
    padding-left: 20px;
    height: 20px;
    background-position: 2px;
}

.hidden {
    display: none;
}

.inline-block {
    display: inline-block;
}

td > input, select {
    width: 100%;
    box-sizing: border-box;
}

td > label {
    text-align: right;
}

.image-preview {
    background-color: white;
}

.dropdown > button {
    display: block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    border: 1px solid rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content a {
    color: black;
    padding: 6px 8px;
    text-decoration: none;
    display: block;
    font-size: 16px;
    white-space: nowrap;
}

.dropdown-content a:hover {
    background-color: #EBEBEB;
}

.dropdown:hover .dropdown-content {
    display: block;
}
</style>
