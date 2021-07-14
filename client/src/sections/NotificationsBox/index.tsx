import { List, Button, Spin } from "antd";
import { bgColor } from "../../lib/bgColor";
import {  useMutation, useQuery } from "@apollo/client";
import { LoadMessages as LoadMessagesData, LoadMessagesVariables } from "../../lib/graphql/queries/Messages/__generated__/LoadMessages";
import { ApproveRequest as ApproveRequestData, ApproveRequestVariables } from "../../lib/graphql/mutations/ApproveRequest/__generated__/ApproveRequest";
import { DeclineRequest as DeclineRequestData, DeclineRequestVariables } from "../../lib/graphql/mutations/DeclineRequest/__generated__/DeclineRequest";
import { LOAD_MESSAGES } from "../../lib/graphql/queries/Messages/index";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import { APPROVE_REQUEST, DECLINE_REQUEST } from "../../lib/graphql/mutations";


const MESSAGE_LIMIT = 5;

type Message = LoadMessagesData["loadMessages"]["results"][0]


export const NotificationsBox = () => {
    const [messages, setMessages]       = useState<Set<Message>>(new Set<Message>());
    const [messagesIdx, setMessagesIdx] = useState<number>(1);

    const [approve, { error : ApproveError }] 
    = useMutation<ApproveRequestData, ApproveRequestVariables>
    (APPROVE_REQUEST);

    const [decline, { error : DeclineError }] 
    = useMutation<DeclineRequestData, DeclineRequestVariables>
    (DECLINE_REQUEST);

    const { loading, data, fetchMore, error } = useQuery<LoadMessagesData, LoadMessagesVariables>(
        LOAD_MESSAGES, {
            variables: {
                limit: MESSAGE_LIMIT,
                page: messagesIdx 
            },
            onCompleted: data => {
                setMessages(
                    messages => {
                        data.loadMessages.results.forEach(
                            data => messages.add(data)
                        )

                        console.log(messages)
                        return messages
                    }
                )
            },
            onError: err => console.log(`This is the error from graphql loadMessages ${err}`)

        }, 
        )

    const handleApprove = async (message_id : string) => {
        await approve(
            { variables : { message_id : message_id } }
        )

        if (!ApproveError) {
            setMessages(messages => {
                const newSet = new Set<Message>();
                messages.forEach(item => {
                    if (item.id !== message_id) newSet.add(item)
                })

                return newSet
            })
            setMessagesIdx(idx => messages.size % MESSAGE_LIMIT === (MESSAGE_LIMIT - 1) ? idx - 1 : idx)
        }
    }


    const handleDecline = async (message_id: string) => {
        await decline(
            { variables : { message_id : message_id } }
        )

        console.log(DeclineError, "Shit fuc")
        if (!DeclineError) {
            setMessages(messages => {
                const newSet = new Set<Message>();
                messages.forEach(item => {
                    if (item.id !== message_id) newSet.add(item)
                })

                return newSet
            })
            //If total data divide by page size and has the remainder of page size - 1
            //That mean it got deducted from a full n page to n - 1 page + page size - 1 data
            //Ex: at start, total data is 20, page size = 5
            //Now, substract 1 from total data, we got 20 and 4 as a remainder
            //Which means at first we have 4 full page, but then we have 3 full page with 4 data, 
            //on the last page, which is not full
            setMessagesIdx(idx => messages.size % MESSAGE_LIMIT === (MESSAGE_LIMIT - 1) ? idx - 1 : idx)

        }

    }


    if (error) {
        throw new Error(`Apollo client error ${error}`)
    }

    useEffect(() => {
        //Whenever the page increase, call refetch
        fetchMore({
            variables: {
                page: messagesIdx, //Only specify the parameter that has been changed
            },
        })
    }, [messagesIdx, fetchMore])


    useEffect(() => {
        //Update the state when there is a change in the data
        if (data)
            setMessages(
                messages => {
                    data.loadMessages.results.forEach(
                        data => messages.add(data)
                    )

                    console.log(messages)
                    return messages
                }
            )
    }, [data])

    return (
            <InfiniteScroll
                initialLoad={true}
                pageStart={1}
                loadMore={() => setMessagesIdx(idx => idx + 1)}
                hasMore={data ? messagesIdx < data.loadMessages.total + 1 ? true : false : false }
            >
                <List
                id="notification-box"
                style={{
                    borderWidth: "thick",
                    borderColor: "black",
                    borderRadius: 5,
                    zIndex: 99, //Make sure this one is always displayed first
                    width: 600, 
                    height: 200,
                    paddingLeft: 20,
                    paddingRight: 20,
                    position: "absolute", 
                    backgroundColor: bgColor.notificationsList,
                    right: "14vh", 
                    overflow: "scroll",
                    top  : "8vh"}}
                dataSource={Array.from(messages)}
                itemLayout="horizontal"
                renderItem={item => (
                <List.Item 
                    style={{height: 100}}
                    actions={[
                            <Button type="primary" onClick={ () => handleApprove(item.id) }>Đồng ý</Button>,
                            <Button type="primary" danger onClick={
                                () => handleDecline(item.id)
                            }>Từ chối</Button>,
                        ]}
                    >
                        <List.Item.Meta
                            style={{height: 90}}
                            description={item.id}
                        />
                        <h4 style={{paddingTop: 30}}>{item.content} {item.organization_name}</h4>
                </List.Item>)}>
                        {loading && ( <Spin />)}
                    </List> 
            </InfiniteScroll>
    )
}


const mock = [
    {
        "name" : "Tran Van Ngu",
        "organization_name": "Thanh Xuan",
        "content": "Toi muon gia nhap thanh vien "
    },
    {
        "name" : "Tran Van Cac",
        "organization_name": "Long Bien",
        "content": "Toi muon gia nhap thanh vien "
    }
]