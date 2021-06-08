declare const require: any;
export const utf8 = require('utf8');


function FixStringValue(value: any) {
    switch (typeof value) {
        case 'string':
            return utf8.decode(value)
        case 'object':
            var newObject = new Object() as any
            for (let attr in value) {
                newObject[attr] = FixStringValue(value[attr])
            }
            return newObject
        default:
            return value
    }
}

export default function encodeFix(json : any) {
    let data = json.toString() /* open the file as string */
    let object = JSON.parse(data) /* parse the string to object */
    let fixed = FixStringValue(object)
    return JSON.stringify(fixed) /* use 3 spaces of indentation */
}