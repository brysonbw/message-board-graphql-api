import { ApolloError } from "apollo-server-express";
import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";  

// Post TYPE
export const Project = objectType({
    name: "Post",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("title");
        t.nonNull.string("content"); 
        t.nonNull.dateTime("createdAt"); 
        t.field("postedBy", {   
            type: "User",
            resolve(parent, args, context) {  
                return context.prisma.post
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
                },
            });
            t.nonNull.list.nonNull.field("voters", { 
                type: "User",
                resolve(parent, args, context) {
                    return context.prisma.post
                        .findUnique({ where: { id: parent.id } })
                        .voters();
                }
            })  
        },
    });



// post QUERY
export const ProjectQuery = extendType({ 
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("posts", {   
            type: "Post",
            resolve(parent, args, context, info) {    
                return context.prisma.post.findMany();
            },
        });
    },
});

// post MUTATION
export const ProjectMutation = extendType({  
    type: "Mutation",    
    definition(t) {


        // create post
        t.nonNull.field("post", {  
            type: "Post",  
            args: {   
                content: nonNull(stringArg()),
                title: nonNull(stringArg()),
            },
            // post validation
            validate: ({ string }) => ({
                content: string().trim().min(7).max(255).required(),
                title: string().min(7).max(50).required(),
            }),


            resolve(parent, args, context) {  
                const { content, title } = args;
                const { userId } = context;

                if (!userId) {  
                    throw new ApolloError("unauthorized", "400");
                }
                const newPost = context.prisma.post.create({   // 2
                    data: {
                        title,
                        content,
                        postedBy: { connect: { id: userId } }
                    },
                });
                return newPost;
            },
        });


        // delete post by ID
        t.nonNull.field("deletePost", {
            type: "Post",
            args: {
              id: nonNull(intArg()),
            },
            resolve(parent, args, context) {
              const deletePost = context.prisma.post.delete({
                where: {
                  id: Number(args.id),
                },
              });
              return deletePost
            },
        })


    },
});