import { GET_REVIEWS, ADD_REVIEW, UPDATE_REVIEW, SET_FEEDBACKS } from "../actions/reviewsActions";


const initialState = {
 
    reviews : [],
    feedbacks:[]

};



const reviewReducer = (state = initialState,action)=>{
    switch(action.type){
     
           case GET_REVIEWS :
            const reviews = action.reviews;
           
            return {
             ...state ,
             reviews : reviews ,
            };

            case ADD_REVIEW :
                const temp = [];
                temp.push(action.review);
                return {...state , reviews : [...state.reviews,...temp]};
             
            case UPDATE_REVIEW :
                    const reviewIndex =state.reviews.findIndex(
                        review => review.clientId === action.review.clientId && review.barberId === action.review.barberId
                      );
                    const review = {
                            barberId : action.review.barberId,
                            clientId : action.review.clientId,
                            comment : action.review.comment,
                            mark : action.review.mark
                    }
                    const updatedReviews = [...state.reviews];
                    updatedReviews[reviewIndex] = review;

                    return {
                        ...state ,
                        reviews : updatedReviews
                     };


        
        
        case SET_FEEDBACKS:
        return{
            ...state,
            feedbacks:action.feedbackData
        }; 
    
    

       default : return state ;
    
    }

    };


export default reviewReducer;