const { GET_TOKENS, ADD_TOKEN, CURRENT_TOKEN ,DELETE_TOKEN} = require("../actions/tokenActions");


const initialState = {
 
    clientTokens : [],
    currentToken : null

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


                
                case DELETE_TOKEN :
                    let tokenDelete = action.token ;
                    let removedTokens = [];
                    removedTokens = state.clientTokens.filter(token=>token !== tokenDelete);


                    return {
                        ...state , 
                        clientTokens : [...state.clientTokens,...removedTokens]
                    };


            case CURRENT_TOKEN :
                let token = action.token ;
     
                return {
                    ...state , 
                    currentToken : token
                };

       default : return state ;
    
    }

    };


export default tokenReducer;