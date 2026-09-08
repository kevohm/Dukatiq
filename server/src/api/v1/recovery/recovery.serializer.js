/**
 * 
 * {
  id: '560b836f-4124-4188-82f7-066d5a94b83b',
  created_at: 2026-07-26T07:45:58.380Z,
  updated_at: 2026-07-26T07:45:58.380Z,
  is_deleted: false,
  user_id: '6a08293a-334e-4309-a37c-e8fa3929c583',
  local_password: '$argon2id$v=19$m=65536,t=3,p=4$IV9/p4N1f8liFnLfeqVa2Q$GgaZ7SngNmMDuYP8XKxE0NPz/e500tkzCk3FE8lrUi4',
  questions: [
    {
      id: 'c7fb24e9-29c8-433a-af29-0efedeba9f65',
      created_at: 2026-07-26T07:46:42.380Z,
      updated_at: 2026-07-26T07:46:42.380Z,
      is_deleted: false,
      user_local_access_id: '560b836f-4124-4188-82f7-066d5a94b83b',
      question: 'What was your first job?',
      question_code: 'first_job',
      answer: '$argon2id$v=19$m=65536,t=3,p=4$eS8TgjABfmeWRQWRozKIGA$/voxf+i7ZTL7TQi56ZK34Uc8AhHIPSJ8H/V7qqEQ7P8'
    },
    {
      id: '2c7c531a-6011-48d7-9dd2-0431187b1c8e',
      created_at: 2026-07-26T07:46:42.380Z,
      updated_at: 2026-07-26T07:46:42.380Z,
      is_deleted: false,
      user_local_access_id: '560b836f-4124-4188-82f7-066d5a94b83b',
      question: "What is your mother's maiden name?",
      question_code: 'mother_maiden_name',
      answer: '$argon2id$v=19$m=65536,t=3,p=4$jxPTjf9Rqnd1il/SUsV+cA$ipr9iZ6C4tXN+jlKwhgJ9OAyu23r4Jty/OvPL+PWXF0'
    }
  ]
}
 */
export class RecoverySerializer {
    static baseSerializer(data) {
        console.log(data)
        return {
            id: data?.id,
            password: data?.local_password,
            user_id: data?.user_id,
            has_local_access: data?.has_local_access,
            
            questions: data?.questions?.map((q) => ({
                id: q?.id,
                user_local_access_id: q?.user_local_access_id,
                question: q?.question,
                code: q?.question_code,
                answer: q?.answer,
            })),
        }
    }
}
