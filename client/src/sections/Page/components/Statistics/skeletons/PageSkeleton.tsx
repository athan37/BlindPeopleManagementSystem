import { Divider, Skeleton, Space } from "antd";

export const PageSkeleton = () => {
    return (
        <div className="summary-container">

        <div className="summary-child">
            {(() => {
                const mainStats = [ { }, { }, { }, { } ] 
                return <>
                    {mainStats.map((_, index) => {
                        return <div className="stats-main__container" 
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                border: "none",
                                WebkitBoxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                borderRadius: "50rem",
                                maxHeight: "90px",
                            }}
                        >
                            <div
                                className="dot"
                            />
                            <div className="stats-main__texts">
                                <Space>
                                    <Skeleton
                                        paragraph={{ rows: 4 }}  
                                    />
                                </Space>
                            </div>
                        </div>

                    })}
                </>
            })()}
        </div>
        <Divider />
        <div className="summary-child">
            <Skeleton />
        </div>
        <Divider />
        <div className="sub-container-flex-row" >
            <div className="age-slider-piechart-panel">
                <div className="wrap-border">
                    <Skeleton />
                </div>
                <div className="wrap-border">
                    <Skeleton />
                </div>
            </div>
            <div className="barchart-stats-panel">
                <div 
                style= {{height: "72%"}}
                className="wrap-border">
                    <Skeleton />
                </div>
                <div className="stast__3-skeleton"
                    style={{
                        display: "flex", justifyContent: "space-between",
                        paddingLeft: 20 
                }} >
                    <Skeleton paragraph={{width: 150}}/>
                    <Skeleton paragraph={{width: 150}}/>
                    <Skeleton paragraph={{width: 150}}/>
                </div>
            </div>
        </div>
        <Divider />
        <div className="summary-child">
                    <Skeleton />
                    <Skeleton />
        </div>
        <Divider />
        <div className="summary-child">
            <div 
                className="stats-card__2nd_type"
                style={{
                    backgroundColor: "#d7f0dd",
                    color: "#35b653"
                }}
            >
                <Skeleton paragraph={{rows: 1}}/>
            </div>
            { true && 
                <div 
                    className="stats-card__2nd_type"
                    style={{
                        backgroundColor: "#dadcf8",
                        color: "#4650dd"
                    }}
                >
                    <Skeleton paragraph={{rows: 1}}/>
                </div>
            }
            <div 
                className="stats-card__2nd_type"
                style={{
                    backgroundColor: "#cfe2ff",
                    color: "#0d6efd"
                }}
            >
                    <Skeleton paragraph={{rows: 1}}/>
            </div>
        </div>

        {/* May be click here again to change title and value to smallest */}

    </div>
    )
}