import { component$, $, useComputed$, type QRL } from "@builder.io/qwik"
import { _ } from "compiled-i18n"
import { Badge, Button } from "~/components/ui"
import { LuPlus } from "@qwikest/icons/lucide"
import { timeAgo } from "~/utils/dateUtils"
import EmptyIssue from "~/components/empty-states/EmptyIssue"
import { Image } from "@unpic/qwik"
import { Card } from "~/components/ui"
import { Pagination } from "@qwik-ui/headless"
import type { Issue } from "~/types/issue"

export interface IssueListProps {
    currentUsername: string
    issues: {
        items: Issue[]
        total: number
        page: number
        size: number
        pages: number
    }
    communityName: string
    onCreateIssue: QRL<() => void>
    onPageChange$: QRL<(page: number) => Promise<void>>
    isAuthenticated: boolean
    onShowLoginModal$: QRL<() => void>
}

export const IssueList = component$<IssueListProps>(
    ({ issues, communityName, onCreateIssue, onPageChange$, isAuthenticated, currentUsername, onShowLoginModal$ }) => {
        const statusColors = useComputed$(() => ({
            OPEN: "bg-green-100 text-green-800",
            IN_PROGRESS: "bg-blue-100 text-blue-800",
            RESOLVED: "bg-purple-100 text-purple-800",
            CLOSED: "bg-gray-100 text-gray-800",
        }))

        const handlePageChange = $((page: number) => {
            onPageChange$(page)
        })

        if (issues.items.length === 0) {
            return (
                <EmptyIssue 
                    onCreateIssue={onCreateIssue} 
                    communityName={communityName}
                />
            )
        }

        return (
            <div class="space-y-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">{_`Issues in ${communityName}`}</h2>
                    <Button onClick$={onCreateIssue} class="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={!isAuthenticated}>
                        <LuPlus class="w-4 h-4 mr-2" />
                        {_`Report Issue`}
                    </Button>
                </div>

                <div class="space-y-4">
                    {issues.items.map((issue) => (
                        <Card key={issue.id} class="hover:shadow-md transition-shadow">
                            <div class="p-4">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-center gap-2">
                                        <Badge
                                            class={statusColors.value[issue.status as keyof typeof statusColors.value] || "bg-gray-100"}
                                        >
                                            {issue.status}
                                        </Badge>
                                        <span class="text-sm text-gray-500">
                                            {_`Reported ${timeAgo(new Date(issue.created_at))} ago`}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm text-gray-500">{_`${issue.views_count} views`}</span>
                                    </div>
                                </div>

                                <h3 class="text-lg font-medium mt-2">
                                    <a href={`/issues/${issue.id}`} class="hover:text-cyan-600">
                                        {issue.title}
                                    </a>
                                </h3>

                                <p class="text-gray-600 mt-2 line-clamp-2">{issue.description}</p>

                                <div class="flex items-center mt-4 gap-2">
                                    <div class="flex items-center">
                                        <Image
                                            src={issue.creator.image || "/placeholder.svg?height=24&width=24"}
                                            alt={issue.creator.username}
                                            class="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span class="text-sm">{issue.creator.username}</span>
                                    </div>

                                    {issue.communities.length > 0 && (
                                        <div class="flex items-center gap-1 ml-4">
                                            {issue.communities.map((community) => (
                                                <Badge key={community.id} class="text-xs">
                                                    {community.name} {community.cca2 && `(${community.cca2})`}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}

                    {issues.pages > 1 && (
                        <div class="mt-4 flex justify-center">
                            <Pagination
                                selectedPage={issues.page}
                                totalPages={issues.pages}
                                onPageChange$={onPageChange$}
                                class="pagination-wrapper"
                                selectedClass="pagination-selected-btn"
                                defaultClass="pagination-btn"
                                dividerClass="pagination-divider"
                                prevButtonClass="prevNextButtons"
                                nextButtonClass="prevNextButtons"
                            />
                        </div>
                    )}
                </div>
            </div>
        )
    },
)

