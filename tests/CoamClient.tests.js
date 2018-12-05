const rewire = require('rewire');
const CoamClient = rewire('../src/CoamClient');
const sinon = require('sinon');
const expect = require('chai').expect;

let fakeAxios = {};

CoamClient.__set__('axiosRetry', function() {

});

let requestStub;
const groupUrl = 'http://full.url.com/132123';
const groupId = '132123';
const roleName = 'Dummy Role';
const accessToken = 'xToken';
const principal = 'xPrincipal';
const resourceType = 'xResourceType';
const resourceIdentifier = 'xResourceIdentifier';
const permission = 'xPermission';


function calledOnceWith(requestStub, args, withNoCache = true) {
    expect(requestStub.calledOnce).to.be.true;
    if (withNoCache && requestStub.args[0][0]['params'] && requestStub.args[0][0].method === 'GET') {
        expect(requestStub.args[0][0]['params'].skipCache).to.exist;
        delete requestStub.args[0][0]['params'].skipCache;
    }
    expect(requestStub.args[0]).to.deep.equal([args]);
}

function mockRequestResponse(resolveWith) {
    requestStub = sinon.stub().returns(Promise.resolve(resolveWith));
    fakeAxios = {
        create: sinon.stub().returns({
            request: requestStub,
        }),
    };
    CoamClient.__set__('axios', fakeAxios);

    return requestStub;
}

describe('CoamClient', function() {
    beforeEach(function() {
        requestStub = mockRequestResponse('yes!');
    });

    it('getGroupInfo', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.getGroupInfo(groupUrl);
        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
                'canonicalize': 'true',
            },
            'url': groupUrl,
        });
    });

    it('hasPermission', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.hasPermission(principal, resourceType, resourceIdentifier, permission);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
            },
            'url': `/auth/access-management/v1/principals/${encodeURIComponent(principal)}/permissions/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceIdentifier)}/${encodeURIComponent(permission)}`,
        });
    });

    it('grantRoleToPrincipal', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.grantRoleToPrincipal(groupUrl, principal, roleName);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
                'canonicalize': 'true',
            },
            'url': groupUrl,
        });
    });

    it('setAdminFlag', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.setAdminFlag(groupId, principal, true);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'is_admin': true,
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}`,
        });
    });

    it('removeUserRole', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.removeUserRole(groupId, principal, roleName);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'remove': [
                    'Dummy Role',
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}/roles`,
        });
    });

    it('addUserRole', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.addUserRole(groupId, principal, roleName);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    'Dummy Role',
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}/roles`,
        });
    });

    it('group56', function() {
        requestStub = mockRequestResponse({data: {groups: []}});
        const client = new CoamClient({accessToken: accessToken});

        client.group56( principal);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {

            },
            'url': `/auth/access-management/v1/principals/${principal}/groups`,
        });
    });

    it('modifyUserRoles', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.modifyUserRoles(groupId, principal, {'add': [roleName]});

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    'Dummy Role',
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members/${principal}/roles`,
        });
    });

    it('addGroupMember', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.addGroupMember(groupId, principal, true);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    {
                        'is_admin': true,
                        'principal': principal,
                    },
                ],
            },
            'params': {
                'canonicalize': true,
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members`,
        });
    });

    it('removeGroupMember', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.removeGroupMember(groupId, principal);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'remove': [
                    principal,
                ],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/members`,
        });
    });

    it('getRoles', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.getRoles();

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'url': `/auth/access-management/v1/roles`,
        });
    });

    it('findPrincipals', function() {
        let requestStub = mockRequestResponse({data: {canonical_principals: []}});
        const client = new CoamClient({accessToken: accessToken});

        client.findPrincipals('asd');

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'params': {
                'canonicalize': true,
                'q': 'asd',
            },
            'url': '/auth/access-management/v1/search/canonicalPrincipals/bySubstring',
        });
    });

    it('createGroup', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.createGroup('name', 'desc');

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'POST',
            'data': {
                'description': 'desc',
                'name': 'name',
            },
            'url': `/auth/access-management/v1/groups`,
        });
    });

    it('removeGroup', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.removeGroup(groupId);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'DELETE',
            'url': `/auth/access-management/v1/groups/${groupId}`,
        });
    });

    it('findGroups', function() {
        let requestStub = mockRequestResponse({data: {canonical_principals: []}});
        const client = new CoamClient({accessToken: accessToken});

        client.findGroups(resourceType, resourceIdentifier);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'params': {
                'resource_identifier': resourceIdentifier,
                'resource_type': resourceType,
            },
            'method': 'GET',
            'url': `/auth/access-management/v1/groups`,
        });
    });

    it('addResourceToGroup', function() {
        let requestStub = mockRequestResponse({data: {canonical_principals: []}});
        const client = new CoamClient({accessToken: accessToken});

        client.addResourceToGroup(groupId, resourceType, resourceIdentifier);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'PATCH',
            'data': {
                'add': [
                    {
                        'resource_identifier': resourceIdentifier,
                        'resource_type': resourceType,
                    },
                ],
                'remove': [],
            },
            'url': `/auth/access-management/v1/groups/${groupId}/resources`,
        });
    });

    it('removeResourceFromGroup', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.removeResourceFromGroup(groupId, resourceType, resourceIdentifier);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'data': {
                'add': [],
                'remove': [{
                    'resource_identifier': resourceIdentifier,
                    'resource_type': resourceType,
                }],
            },
            'method': 'PATCH',
            'url': `/auth/access-management/v1/groups/${groupId}/resources`,
        });
    });

    it('getUserPermissionsForResourceType', function() {
        const client = new CoamClient({accessToken: accessToken});

        client.getUserPermissionsForResourceType(principal, resourceType);

        calledOnceWith(requestStub, {
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
            },
            'method': 'GET',
            'url': `/auth/access-management/v1/principals/${principal}/permissions/${resourceType}`,
        });
    });
});