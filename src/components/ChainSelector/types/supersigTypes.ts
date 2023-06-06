export const supersigTypes = {

    CallId: 'u32',
    FetchListProposals: {
        no_of_members: 'u32',
        proposals_info: 'ProposalStates'
    },
    FetchProposalState: {
        no_of_members: 'u32',
        proposal_info: 'ProposalState<AccountId>'
    },
    ProposalState: {
        encoded_call: 'Vec<u8>',
        id: 'CallId',
        provider: 'AccountId',
        voters: 'Vec<AccountId>'
    },
    ProposalStates: 'Vec<ProposalState<AccountId>>',
    Role: {
        _enum: {
        Master: 'Vec<u8>',
        NotMember: 'Vec<u8>',
        Standard: 'Vec<u8>'
        }
    },
    SupersigId: 'u132'

}

export default supersigTypes