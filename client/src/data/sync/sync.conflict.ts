// import type { RxConflictHandler, RxConflictHandlerOutput, RxDocument } from 'rxdb'

// export const naturalConflictHandler: RxConflictHandler<any> = async (
//     input,
//     context
// ): Promise<RxConflictHandlerOutput<any>> => {
//     const serverDoc = input.realServerState
//     const clientDoc = input.newDocumentState

//     // If IDs don't match, the server already owns this natural record.
//     // Adopt the server's Primary Key while preserving local updates.
//     if (serverDoc.id !== clientDoc.id) {
//         return {
//             isEqual: false,
//             documentData: {
//                 ...clientDoc, // Keep client fields (price, changes, etc.)
//                 id: serverDoc.id, // MUST override local ID with server ID!
//                 updated_at: Math.max(
//                     new Date(serverDoc.updated_at).getTime(),
//                     new Date(clientDoc.updated_at).getTime()
//                 ),
//             },
//         }
//     }

//     // Standard timestamp check if IDs DO match
//     if (new Date(serverDoc.updated_at) > new Date(clientDoc.updated_at)) {
//         return { isEqual: false, documentData: serverDoc }
//     }

//     return { isEqual: false, documentData: clientDoc }
// }
