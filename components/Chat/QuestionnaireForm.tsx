import React, {ChangeEvent, useState} from 'react';
import {LlamaIndex} from "@/types";

interface Input {
    value: string;
}

interface Props {
    indexName: string;
}

interface QueryResponse {
    responseMessage: string;
}

function QuestionnaireForm({ indexName }: Props) {
    const [inputs, setInputs] = useState<Input[]>([{value: ''}, {value: ''}]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddInputs = () => {
        setInputs([...inputs, {value: ''}, {value: ''}]);
    };

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newInputs = [...inputs];
        newInputs[index].value = event.target.value;
        setInputs(newInputs);
    };

    const handleAutoGenerateAnswers = async (questionIndex: number, answerIndex: number) => {
        setIsGenerating(true);
        const newInputs = [...inputs];
        const question = inputs[questionIndex].value;

        const response = await fetch(
            `/api/query?message=${question}&indexName=${indexName}`, {
                method: 'GET'
            }).then((response) => response.json())
            .then((data) => {
                console.log("handle response:" + data.responseMessage);
                newInputs[answerIndex].value = data.responseMessage;
                setInputs(newInputs);
                setIsGenerating(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setIsGenerating(false);
            });
        
    }

    return (
        <form className="text-center items-center">
            {inputs.map((input, index) => (
                <>
                    <div className="mb-6 mt-8 px-16 w-full text-center flex items-center ml-auto mr-auto">

                        {index % 2 === 0 && (
                            <>
                                <label htmlFor="small-input"
                                       className="block mb-2 mr-2 text-sm font-medium text-gray-900 dark:text-white">Question:</label>
                                <input type="text" id="default-input"
                                       className="bg-gray-20 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Type a question first..."
                                       key={index}
                                       value={input.value}
                                       onChange={(event) => handleInputChange(index, event)}/>
                            </>
                        )}
                        {index % 2 !== 0 && (
                            <>
                                <label htmlFor="small-input"
                                       className="block mb-2 mr-4 text-sm font-medium text-gray-900 dark:text-white">Answer:</label>
                                <textarea id="message"
                                          rows={5}
                                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-20 rounded-lg border border-gray-300
                                          focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          placeholder="Auto generate answer by click the button......" value={input.value}></textarea>
                                <button type="button"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                        onClick={() => handleAutoGenerateAnswers(index-1, index)}>
                                    {isGenerating ? "Generating..." : "Auto Generate"}
                                </button>
                            </>
                        )}

                    </div>
                </>
            ))}
            <button type="button"
                    onClick={handleAddInputs}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-auto mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Add more questions
            </button>
        </form>
    );
}

export default QuestionnaireForm;