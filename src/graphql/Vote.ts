import { objectType, extendType, nonNull, intArg } from "nexus";
import { User } from "@prisma/client";
import { ApolloError } from "apollo-server-express";

// Vote TYPE
export const Vote = objectType({  
    name: "Vote",
    definition(t) {
        t.nonNull.field("post", { type: "Post" });
        t.nonNull.field("user", { type: "User" });
    },
});

// vote MUTATION
export const VoteMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("vote", {
            type: "Vote",
            args: {
                postId: nonNull(intArg()),
            },

            // check if postId input exist
            validate: async (_, { postId }, { prisma }) => {
                const post = await prisma.post.findUnique(
                    {
                        where: {id: postId}
                    }
                )
                if (post?.id !== postId) {
                    throw new ApolloError('Id for project does not exist', '400');
                  }
              },
            
            async resolve(parent, args, context) {
                const { userId } = context;
                const { postId } = args;

                if (!userId) {  
                    throw new ApolloError("unauthorized", "400");
                }


                const post = await context.prisma.post.update({  
                    where: {
                        id: postId
                    },
                    data: {
                        voters: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                })

                const user = await context.prisma.user.findUnique({ where: { id: userId } });

                

                return {  
                    post,
                    user: user as User
                };
            },
        })
    }
})