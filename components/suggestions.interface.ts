
export interface ISuggestions {
    
    /**
     * Sets data which is going to be displayed in the suggestions
     * dropdown
     *
     */
    setData(data:Object);
    
    /**
     * Gets current suggestions data
     *
     *
     */
    getData(): Object;

    /**
     * If there are suggestions in the data object
     *
     *
     */
    hasSuggestions(): boolean;
    
    /**
     * Method gets called when user hits down/up arrow while
     * input field is focused
     *
     */
    didMoveUpDown(up:boolean);
    
    /**
     * When dropdown item is selected/clicked directly from the list
     *
     *
     */
    didSelected(item:any);
}
