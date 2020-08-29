const { GET_TOKENS, ADD_TOKEN } = require("../actions/tokenActions");


const initialState = {
 
    clientTokens : [],
   

};

const tokenReducer = (state = initialState,action)=>{
    switch(action.type){
     
           case GET_TOKENS :
            const tokens = action.tokens;

            return {
             ...state ,
             clientTokens : tokens ,
            };

            case ADD_TOKEN :
                let temp = [];
                temp.push(action.token);
               
                return {
                    ...state , 
                    clientTokens : [...state.clientTokens,...temp]
                };

       default : return state ;
    
    }

    };


export default tokenReducer;