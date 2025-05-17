const fs = require('fs')
const path = require('path')

const systemToken = 'mock-echo-system-token'

const providers = [
  'SEDAC',
  'LARC',
  'MMT_1',
  'MMT_2',
  'NSIDC_ECS'
]

const clearCache = async () => {
  await fetch('http://localhost:2999/clear-cache', {
    method: 'POST'
  })

  await fetch('http://localhost:3011/caches/clear-cache?token=mock-echo-system-token', {
    method: 'POST'
  })
}

const createUsers = async () => {
  // Create Users (and their tokens) in Mock Echo
  await fetch('http://localhost:3008/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      token: {
        username: 'admin',
        password: 'admin',
        client_id: 'dev test',
        user_ip_address: '127.0.0.1',
        group_guids: ['guidMMTAdmin']
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('Created admin user:', jsonData)
    })

  await fetch('http://localhost:3008/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      token: {
        username: 'typical',
        password: 'user',
        client_id: 'dev test',
        user_ip_address: '127.0.0.1',
        group_guids: ['guidMMTUser']
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('Created typical user:', jsonData)
    })

  await fetch('http://localhost:3008/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      token: {
        username: 'new-user',
        password: 'user',
        client_id: 'dev test',
        user_ip_address: '127.0.0.1'
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('Created new-user user:', jsonData)
    })
}

const createProviders = async () => {
  // Create providers
  await Promise.all(providers.map(async (providerId) => {
    console.log('Creating provider:', providerId)

    await fetch('http://localhost:3002/providers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify({
        MetadataSpecification: {
          Name: 'Provider',
          Version: '1.0.0',
          URL: 'https://cdn.earthdata.nasa.gov/schemas/provider/v1.0.0'
        },
        ProviderId: providerId,
        DescriptionOfHolding: 'PROV1 Testing.',
        Organizations: [
          {
            ShortName: providerId,
            Roles: ['PUBLISHER'],
            URLValue: 'https://quidditch.example.gov/'
          }],
        Administrators: ['test.user'],
        Consortiums: ['EOSDIS']
      })
    })
  }))
}

const createGroups = async () => {
  // Create System and Provider Groups
  const groupConceptIds = {}

  // Create system level group
  // By default CMR creates a system group 'Administrators' but we should create our own
  await fetch('http://localhost:3011/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      name: 'Administrators_2',
      description: 'The group of users that manages the CMR.'
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('Created system level group Administrators_2 in access control:', jsonData)

      const { concept_id: conceptId } = jsonData
      groupConceptIds.Administrators_2 = conceptId
    })

  // Create provider groups
  await Promise.all(providers.map(async (providerId) => {
    await fetch('http://localhost:3011/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify({
        name: `${providerId} Admin Group`,
        description: 'Test group for provider',
        provider_id: `${providerId}`
      })
    }).then((response) => response.json())
      .then((jsonData) => {
        console.log(`Created ${providerId} group in access control:`, jsonData)

        const { concept_id: conceptId } = jsonData
        groupConceptIds[providerId] = conceptId
      })
  }))

  return groupConceptIds
}

// Add collection permissions, aka CATALOG_ITEM_ACLs, and INGEST_MANAGEMENT_ACLs for providers
const createProviderAcls = async () => {
  await Promise.all(providers.map(async (providerId) => {
    await fetch('http://localhost:3011/acls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify({
        group_permissions: [{
          permissions: ['read'],
          user_type: 'guest'
        }, {
          permissions: ['read'],
          user_type: 'registered'
        }],
        catalog_item_identity: {
          name: `${providerId} All Collections and Granules`,
          provider_id: providerId,
          collection_applicable: true,
          granule_applicable: true
        }
      })
    }).then((response) => response.json())
      .then((jsonData) => {
        console.log(`Catalog Item ACL for guest and registered users for ${providerId}:`, jsonData)
      })

    await fetch('http://localhost:3011/acls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify({
        group_permissions: [{
          user_type: 'guest',
          permissions: ['read', 'update']
        }, {
          user_type: 'registered',
          permissions: ['read', 'update']
        }],
        provider_identity: {
          target: 'INGEST_MANAGEMENT_ACL',
          provider_id: providerId
        }
      })
    }).then((response) => response.json())
      .then((jsonData) => {
        console.log(`ACL for INGEST_MANAGEMENT_ACL for guest and registered users for ${providerId}:`, jsonData)
      })
  }))
}

// Add users to groups
const addUsersToGroups = async (groupConceptIds) => {
  // For the local CMR, we need to add the users to the locally mocked URS
  // (in mock echo) before adding them into groups

  // Add administrative and regular users to the locally mocked URS, so they
  // can be added to groups for ACLs and permissions and given appropriate
  // permissions for groups, permissions, etc.

  // Users 'admin' and 'typical' are created first above with tokens ABC-1 and ABC-2
  // Users 'adminuser' and 'testuser' are the urs_uids used in our tests
  await fetch('http://localhost:3008/urs/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{
      username: 'admin',
      password: 'admin'
    }, {
      username: 'typical',
      password: 'password'
    }, {
      username: 'adminuser',
      password: 'admin'
    }, {
      username: 'testuser',
      password: 'password'
    }, {
      username: 'new-user',
      password: 'password'
    }])
  })

  // Add admin users to Administrators_2 group
  await fetch(`http://localhost:3011/groups/${groupConceptIds.Administrators_2}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify(['admin', 'adminuser'])
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('Add admin and adminuser to Administrators_2:', jsonData)
    })

  // Add admin users to SEDAC group, and non-admin users to other providers
  await Promise.all(providers.map(async (providerId) => {
    const users = providerId === 'SEDAC' ? ['admin', 'adminuser'] : ['typical', 'testuser']

    await fetch(`http://localhost:3011/groups/${groupConceptIds[providerId]}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify(users)
    }).then((response) => response.json())
      .then((jsonData) => {
        console.log(`Add ${users} to ${providerId} group:`, jsonData)
      })
  }))
}

// Create ACLs
const createAcls = async (groupConceptIds) => {
  // ACL for CRUD for ACLs for Administrators_2, read access for registered users
  // read access means they can query/see any ACL and get a response
  // this means all registered users don't need to add read rights for
  // PROVIDER_OBJECT_ACL for a user to see if they have that PROVIDER_CONTEXT
  // also any user in Administrators_2 has full access to any ACL in the system
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        group_id: groupConceptIds.Administrators_2,
        permissions: ['read', 'create', 'update', 'delete']
      }, {
        user_type: 'registered',
        permissions: ['read']
      }],
      system_identity: { target: 'ANY_ACL' }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('ANY_ACL CRUD access for Administrators_2 and read for registered users:', jsonData)
    })

  // ACL for admin and typical user to have provider context for MMT_1
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        group_id: groupConceptIds.MMT_1,
        permissions: ['read']
      }, {
        group_id: groupConceptIds.Administrators_2,
        permissions: ['read']
      }],
      provider_identity: {
        target: 'PROVIDER_CONTEXT',
        provider_id: 'MMT_1'
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('ACL for admin and typical user to read PROVIDER_CONTEXT for MMT_1:', jsonData)
    })

  // ACL for admin and typical user to have provider context for MMT_2
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        group_id: groupConceptIds.MMT_2,
        permissions: ['read']
      }, {
        group_id: groupConceptIds.Administrators_2,
        permissions: ['read']
      }],
      provider_identity: {
        target: 'PROVIDER_CONTEXT',
        provider_id: 'MMT_2'
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('ACL for admin and typical user to read PROVIDER_CONTEXT for MMT_2:', jsonData)
    })

  // ACLs for Groups

  // Create ACL for system level groups for Administrators_2
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        group_id: groupConceptIds.Administrators_2,
        permissions: ['read', 'create']
      }],
      system_identity: { target: 'GROUP' }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('ACL for system level groups for Administrators_2 in access control:', jsonData)
    })

  // ACL for users for Provider groups
  await Promise.all(providers.map(async (providerId) => {
    const users = providerId === 'SEDAC' ? ['admin', 'adminuser'] : ['typical', 'testuser']

    await fetch('http://localhost:3011/acls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify({
        group_permissions: [{
          group_id: groupConceptIds[providerId],
          permissions: ['read', 'create']
        }],
        provider_identity: {
          target: 'GROUP',
          provider_id: providerId
        }
      })
    }).then((response) => response.json())
      .then((jsonData) => {
        console.log(`Add ${users} to ${providerId} group:`, jsonData)
      })
  }))

  // ACL for admin and typical user to create tags
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        group_id: groupConceptIds.MMT_2,
        permissions: ['create', 'update', 'delete']
      }, {
        group_id: groupConceptIds.Administrators_2,
        permissions: ['create', 'update', 'delete']
      }],
      system_identity: { target: 'TAG_GROUP' }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('ACL for tags for MMT_2 and Administrators_2 in access control:', jsonData)
    })
}

// ACL to manage Provider Identity ACLs (PROVIDER_OBJECT_ACL)
const createProviderIdentityAcls = async (groupConceptIds) => {
  const providerIdentityProviders = [
    providers[2],
    providers[3],
    providers[4]
  ]

  // ACL for regular users to manage Provider Identity ACLs for MMT_1, MMT_2 and NSIDC_ECS
  await Promise.all(providerIdentityProviders.map(async (providerId) => {
    await fetch('http://localhost:3011/acls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify({
        group_permissions: [{
          group_id: groupConceptIds[providerId],
          permissions: ['read', 'create', 'update', 'delete']
        }],
        provider_identity: {
          target: 'PROVIDER_OBJECT_ACL',
          provider_id: providerId
        }
      })
    }).then((response) => response.json())
      .then((jsonData) => {
        console.log(`ACL for CRUD permissions for typical users on Provider Identity ACLs for ${providerId}`, jsonData)
      })
  }))
}

// ACLs for collection permissions (CATALOG_ITEM_ACL)
const createCollectionAcls = async (groupConceptIds) => {
  const collectionProviders = [
    providers[1],
    providers[2],
    providers[3]
  ]

  // ACL for regular users to manage Provider Identity ACLs for LARC, MMT_1 and MMT_2
  await Promise.all(collectionProviders.map(async (providerId) => {
    await fetch('http://localhost:3011/acls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: systemToken
      },
      body: JSON.stringify({
        group_permissions: [{
          group_id: groupConceptIds[providerId],
          permissions: ['read', 'create', 'update', 'delete']
        }],
        provider_identity: {
          target: 'CATALOG_ITEM_ACL',
          provider_id: providerId
        }
      })
    }).then((response) => response.json())
      .then((jsonData) => {
        console.log(`ACL for typical users to read and create catalog item ACLs for ${providerId}`, jsonData)
      })
  }))

  // ACL to give admin user read on NSIDC_ECS collections
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        permissions: ['read'],
        group_id: groupConceptIds.Administrators_2
      }],
      catalog_item_identity: {
        name: 'NSIDC_ECS All Collections and Granules for admins',
        provider_id: 'NSIDC_ECS',
        collection_applicable: true,
        granule_applicable: true
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('Catalog Item ACL for admin users for NSIDC_ECS:', jsonData)
    })

  // ACL in access control for admin and typical user to create catalog item ACLs for NSIDC_ECS
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        group_id: groupConceptIds.NSIDC_ECS,
        permissions: ['read', 'create', 'update', 'delete']
      }, {
        group_id: groupConceptIds.Administrators_2,
        permissions: ['read', 'create', 'update', 'delete']
      }],
      provider_identity: {
        target: 'CATALOG_ITEM_ACL',
        provider_id: 'NSIDC_ECS'
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('ACL for admin and typical user to read and create catalog item ACLs for NSIDC_ECS, via access control:', jsonData)
    })
}

const insertMetadata = async () => {
  let nsidcTestCaseCollectionConceptId

  const directory = path.join('setup', 'data')

  const files = fs.readdirSync(directory)

  // Using a for loop here to ensure that each collection is ingested sequentially
  // This is on purpose, so we can ignore the no-await-in-loop eslint rule within this loop
  for (let index = 0; index < files.length; index += 1) {
    const filename = files[index]

    const contents = fs.readFileSync(path.join(directory, filename), 'utf8')
    const json = JSON.parse(contents)

    const {
      collectionUri,
      granule,
      ingestCount,
      metadata,
      testCase,
      type
    } = json

    let added = 0
    for (let ingestIndex = 0; ingestIndex < ingestCount; ingestIndex += 1) {
      let contentType = 'application/echo10+xml'
      if (type === 'dif10') contentType = 'application/dif10+xml'
      if (type === 'iso-smap') contentType = 'application/iso:smap+xml'

      let url
      const headers = {
        'Content-Type': contentType,
        Authorization: systemToken,
        'Cmr-Validate-Keywords': 'false'
      }

      if (collectionUri.includes('EDF_DEV06')) {
        url = `http://localhost:3002/providers/LARC/collections/collection${index}`
      } else if (collectionUri.includes('NSIDC_ECS')) {
        url = `http://localhost:3002/providers/NSIDC_ECS/collections/collection${index}`
        headers.Accept = 'application/json'
      } else if (collectionUri.includes('SEDAC')) {
        url = `http://localhost:3002/providers/SEDAC/collections/collection${index}`
      } else {
        url = `http://localhost:3002/providers/LARC/collections/collection${index}`
      }

      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: metadata
      })

      if (response.ok) {
        added += 1
        console.log(`Loaded ${added} collections (${filename}) ${testCase}`)

        if (collectionUri.includes('NSIDC_ECS') && metadata.includes('Near-Real-Time SSMIS EASE-Grid Daily Global Ice Concentration and Snow Extent V004')) {
          // eslint-disable-next-line no-await-in-loop
          const collectionJson = await response.json()
          const { 'concept-id': conceptId } = collectionJson
          nsidcTestCaseCollectionConceptId = conceptId
        }
      } else {
        console.log(`Error ingesting a collection (${filename}):`, response)
        // eslint-disable-next-line no-await-in-loop
        const responseJson = await response.text()
        console.log(`Error ingesting a collection (${filename}):`, responseJson)
      }

      if (granule) {
        // eslint-disable-next-line no-await-in-loop
        const granuleResponse = await fetch(`http://localhost:3002/providers/LARC/granules/granule-${index}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/echo10+xml',
            Authorization: systemToken
          },
          body: granule
        })

        if (granuleResponse.ok) {
          console.log(`Loaded a granule from collection (${filename})`)
        } else {
          console.log(`Failed to load a granule from collection (${filename}):`, granuleResponse)
        }
      }
    }
  }

  return nsidcTestCaseCollectionConceptId
}

const waitForIndexing = async () => {
  // The following two methods are used in our tests, and also were often used
  // together by older apps that interacted with CMR
  // Wait for the CMR queue to be empty
  await fetch('http://localhost:2999/message-queue/wait-for-terminal-states', {
    method: 'POST',
    headers: {
      Authorization: systemToken
    }
  })

  // Refresh the ElasticSearch index
  await fetch('http://localhost:9210/_refresh', {
    method: 'POST',
    headers: {
      Authorization: systemToken
    }
  })
}

const reindexPermittedGroups = async () => {
  // This method reindexes groups, which may be required when ACLs are added or changed in mock echo
  await fetch('http://localhost:3002/jobs/reindex-collection-permitted-groups', {
    method: 'POST',
    headers: {
      Authorization: systemToken
    }
  })
}

const additionalCmrSetup = async (nsidcTestCaseCollectionConceptId) => {
  // We are running these later in the sequence because one of the ACLs is for a single entry title, which is best to create after the collection has been ingested
  await waitForIndexing()
  await reindexPermittedGroups()
  await waitForIndexing()
  await clearCache()

  // ACL (collection permission, aka catalog item acl) for NSIDC_ECS for access to a single entry title for all guest and all registered users, via access control
  await fetch('http://localhost:3011/acls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: systemToken
    },
    body: JSON.stringify({
      group_permissions: [{
        permissions: ['read'],
        user_type: 'guest'
      }, {
        permissions: ['read'],
        user_type: 'registered'
      }],
      catalog_item_identity: {
        name: 'NSIDC_ECS single collection',
        provider_id: 'NSIDC_ECS',
        collection_applicable: true,
        granule_applicable: true,
        collection_identifier: { concept_ids: [nsidcTestCaseCollectionConceptId] }
      }
    })
  }).then((response) => response.json())
    .then((jsonData) => {
      console.log('Collection Permission for single entry title for NSIDC_ECS, via access control', jsonData)
    })

  await waitForIndexing()
  await reindexPermittedGroups()
  await waitForIndexing()
  await clearCache()
}

const setupCmr = async () => {
  // Make sure CMR is up
  await fetch('http://localhost:3003/collections.json')
    .then(async () => {
      await createUsers()
      await createProviders()
      await clearCache()

      const groupConceptIds = await createGroups()
      await clearCache()

      await createProviderAcls()
      await clearCache()

      await addUsersToGroups(groupConceptIds)
      await clearCache()

      await createAcls(groupConceptIds)
      await clearCache()

      await createProviderIdentityAcls(groupConceptIds)
      await clearCache()

      await createCollectionAcls(groupConceptIds)
      await clearCache()

      const nsidcTestCaseCollectionConceptId = await insertMetadata()

      await additionalCmrSetup(nsidcTestCaseCollectionConceptId)

      console.log('Done!')
    })
    .catch(() => {
      console.log('CMR is not running')
    })
}

setupCmr()
