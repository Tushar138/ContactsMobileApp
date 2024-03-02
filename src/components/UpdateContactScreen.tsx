import { DataInput } from "./DataInput"

export const UpdateContactScreen = (props: any) => {

    return (
        <>
            <DataInput navigation={props.navigation} route={props.route} />
        </>
    )
}